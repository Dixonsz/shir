from app.models.appointment import Appointment
from app.models.appointment_service import AppointmentService as AppointmentServiceModel
from app.models.service_product import ServiceProduct
from app.models.additional import Additional
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.appointment_service_repository import AppointmentServiceRepository
from app.repositories.service_product_repository import ServiceProductRepository
from app.repositories.additional_repository import AdditionalRepository
from app.repositories.client_repository import ClientRepository
from app.repositories.member_repository import MemberRepository
from app.repositories.service_repository import ServiceRepository
from app.repositories.product_repository import ProductRepository
from datetime import datetime
import unicodedata

class AppointmentService:

    @staticmethod
    def _normalize_role_name(role_name):
        if role_name is None:
            return ''

        normalized = unicodedata.normalize('NFD', str(role_name))
        normalized = ''.join(ch for ch in normalized if unicodedata.category(ch) != 'Mn')
        normalized = normalized.strip().lower()

        if normalized == 'employee':
            return 'estilista'

        return normalized

    @staticmethod
    def _member_has_stylist_role(member):
        if not member:
            return False

        role_names = getattr(member, 'role_names', None) or []
        if not role_names and getattr(member, 'rol', None):
            role_names = [member.rol.name]

        return any(
            AppointmentService._normalize_role_name(role_name) == 'estilista'
            for role_name in role_names
        )

    @staticmethod
    def _normalize_notes(notes_value):
        if notes_value is None:
            return None

        notes = str(notes_value).strip()
        return notes if notes else None

    @staticmethod
    def _get_reserved_quantity_for_product(appointment_id, product_id):
        required_products = AppointmentService._get_required_products_by_appointment(appointment_id)
        return int(required_products.get(product_id, 0))

    @staticmethod
    def _get_required_products_by_appointment(appointment_id):
        """Agrupa la cantidad requerida por producto en toda la cita."""
        required_products = {}
        appointment_services = AppointmentServiceRepository.get_by_appointment_id(appointment_id)

        for appointment_service in appointment_services:
            service_products = ServiceProductRepository.get_by_appointment_service_id(appointment_service.id)
            for service_product in service_products:
                quantity = int(service_product.quantity_product or 0)
                if quantity <= 0:
                    continue
                required_products[service_product.product_id] = (
                    required_products.get(service_product.product_id, 0) + quantity
                )

        return required_products

    @staticmethod
    def _consume_products_stock(appointment_id):
        """Descuenta stock de productos asociados a la cita (sin commit aquí)."""
        required_products = AppointmentService._get_required_products_by_appointment(appointment_id)

        if not required_products:
            return {"success": True}

        products_to_update = []

        for product_id, required_quantity in required_products.items():
            product = ProductRepository.get_product_by_id(product_id)
            if not product:
                return {
                    "success": False,
                    "error": f"Producto asociado no encontrado o inactivo (ID: {product_id})."
                }

            if product.stock < required_quantity:
                return {
                    "success": False,
                    "error": (
                        f"Stock insuficiente para '{product.name}'. "
                        f"Disponible: {product.stock}, requerido: {required_quantity}."
                    )
                }

            products_to_update.append((product, required_quantity))

        for product, required_quantity in products_to_update:
            product.stock -= required_quantity

        return {"success": True}

    @staticmethod
    def create_appointment(data):
        client_id = int(data['client_id']) if data.get('client_id') else None
        member_id = int(data['member_id']) if data.get('member_id') else None
        
        if not ClientRepository.get_by_id(client_id):
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        
        member = MemberRepository.get_by_id(member_id)
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }

        if not AppointmentService._member_has_stylist_role(member):
            return {
                "success": False,
                "error": "Solo se pueden asignar miembros con rol estilista a una cita."
            }

        scheduled_date = None
        if data.get('scheduled_date'):
            try:
                scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
            except:
                scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%dT%H:%M')

        appointment = Appointment(
            client_id=client_id,
            member_id=member_id,
            scheduled_date=scheduled_date,
            status=data.get('status', 'scheduled'),
            notes=AppointmentService._normalize_notes(data.get('notes')),
            is_active=data.get('is_active', True)
        )

        created = AppointmentRepository.create(appointment)

        services_data = data.get('services', [])
        products_data = data.get('products', [])
        additionals_data = data.get('additionals', [])
        
        appointment_services_created = []
        
        for service_data in services_data:
            service_id = int(service_data.get('service_id'))
            service = ServiceRepository.get_by_id(service_id)
            if not service:
                continue
            
            price_applied = service_data.get('price_applied', service.price)
            
            appointment_service = AppointmentServiceModel(
                appointment_id=created.id,
                service_id=service_id,
                price_applied=price_applied
            )
            
            created_service = AppointmentServiceRepository.create(appointment_service)
            appointment_services_created.append(created_service)
        
        for product_data in products_data:
            product_id = int(product_data.get('product_id'))
            service_index = int(product_data.get('service_index', 0))
            quantity = int(product_data.get('quantity_product', 1))
            
            if service_index < len(appointment_services_created):
                appointment_service_id = appointment_services_created[service_index].id
                
                product = ProductRepository.get_product_by_id(product_id)
                if product:
                    service_product = ServiceProduct(
                        appointment_service_id=appointment_service_id,
                        product_id=product_id,
                        quantity_product=quantity
                    )
                    ServiceProductRepository.create(service_product)
        
        for additional_data in additionals_data:
            concept = additional_data.get('concept')
            price = float(additional_data.get('price', 0))
            
            if concept and price > 0:
                additional = Additional(
                    appointment_id=created.id,
                    concept=concept,
                    price=price
                )
                AdditionalRepository.create(additional)

        return {
            "success": True,
            "data": created.to_dict(include_services=True, include_total=True)
        }
    
    @staticmethod
    def get_appointment_by_id(appointment_id, include_services=False, include_total=False):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        return {
            "success": True,
            "data": appointment.to_dict(include_services=include_services, include_total=include_total)
        }
    
    @staticmethod
    def get_all_appointments(include_services=False, include_total=False):
        appointments = AppointmentRepository.get_all()
        return {
            "success": True,
            "data": [appointment.to_dict(include_services=include_services, include_total=include_total) for appointment in appointments] if appointments else []
        }
    
    @staticmethod
    def update_appointment(appointment_id, data):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }

        current_status = appointment.status
        next_status = data.get('status', current_status)

        # El consumo de inventario se aplica una sola vez al cerrar la cita.
        if current_status != 'completed' and next_status == 'completed':
            stock_result = AppointmentService._consume_products_stock(appointment_id)
            if not stock_result['success']:
                return stock_result
        
        if 'client_id' in data and data['client_id']:
            appointment.client_id = int(data['client_id'])
        
        if 'member_id' in data and data['member_id']:
            member = MemberRepository.get_by_id(int(data['member_id']))
            if not member:
                return {
                    "success": False,
                    "error": "Miembro no encontrado."
                }

            if not AppointmentService._member_has_stylist_role(member):
                return {
                    "success": False,
                    "error": "Solo se pueden asignar miembros con rol estilista a una cita."
                }

            appointment.member_id = int(data['member_id'])
        
        if data.get('scheduled_date'):
            try:
                appointment.scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
            except:
                appointment.scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%dT%H:%M')
        
        appointment.status = next_status
        if 'notes' in data:
            appointment.notes = AppointmentService._normalize_notes(data.get('notes'))
        appointment.is_active = data.get('is_active', appointment.is_active)

        updated = AppointmentRepository.update(appointment)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_appointment(appointment_id):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        AppointmentRepository.delete(appointment)
        return {
            "success": True,
            "message": "Cita eliminada correctamente."
        }
    
    @staticmethod
    def get_appointments_by_client(client_id):
        appointments = AppointmentRepository.get_by_client_id(client_id)
        return {
            "success": True,
            "data": [appointment.to_dict() for appointment in appointments] if appointments else []
        }
    
    @staticmethod
    def get_appointments_by_member(member_id):
        appointments = AppointmentRepository.get_by_member_id(member_id)
        return {
            "success": True,
            "data": [appointment.to_dict() for appointment in appointments] if appointments else []
        }
    
    
    @staticmethod
    def add_service_to_appointment(appointment_id, data):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        
        if appointment.status == 'completed':
            return {
                "success": False,
                "error": "No se pueden agregar servicios a una cita completada."
            }
        
        service_id = int(data.get('service_id'))
        service = ServiceRepository.get_by_id(service_id)
        if not service:
            return {
                "success": False,
                "error": "Servicio no encontrado."
            }
        
        existing = AppointmentServiceRepository.get_by_appointment_and_service(appointment_id, service_id)
        if existing:
            return {
                "success": False,
                "error": "Este servicio ya está agregado a la cita."
            }
        
        price_applied = data.get('price_applied', service.price)
        
        appointment_service = AppointmentServiceModel(
            appointment_id=appointment_id,
            service_id=service_id,
            price_applied=price_applied
        )
        
        created = AppointmentServiceRepository.create(appointment_service)
        
        return {
            "success": True,
            "data": {
                "id": created.id,
                "appointment_id": created.appointment_id,
                "service_id": created.service_id,
                "service_name": service.name,
                "price_applied": created.price_applied,
                "created_at": created.created_at.isoformat() if created.created_at else None
            }
        }
    
    @staticmethod
    def update_appointment_service(appointment_id, appointment_service_id, data):
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        if 'price_applied' in data:
            appointment_service.price_applied = data['price_applied']
        
        updated = AppointmentServiceRepository.update(appointment_service)
        
        return {
            "success": True,
            "data": {
                "id": updated.id,
                "appointment_id": updated.appointment_id,
                "service_id": updated.service_id,
                "service_name": updated.service.name,
                "price_applied": updated.price_applied,
                "updated_at": updated.updated_at.isoformat() if updated.updated_at else None
            }
        }
    
    @staticmethod
    def remove_service_from_appointment(appointment_id, appointment_service_id):
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        AppointmentServiceRepository.delete(appointment_service)
        
        return {
            "success": True,
            "message": "Servicio eliminado de la cita correctamente."
        }
    
    @staticmethod
    def get_appointment_services(appointment_id):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        
        appointment_services = AppointmentServiceRepository.get_by_appointment_id(appointment_id)
        
        data = []
        for appt_service in appointment_services:
            service = appt_service.service
            data.append({
                "id": appt_service.id,
                "appointment_id": appt_service.appointment_id,
                "service_id": appt_service.service_id,
                "service_name": service.name if service else None,
                "price_applied": appt_service.price_applied,
                "created_at": appt_service.created_at.isoformat() if appt_service.created_at else None
            })
        
        return {
            "success": True,
            "data": data
        }
    
    
    @staticmethod
    def add_product_to_service(appointment_id, appointment_service_id, data):
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if appointment and appointment.status == 'completed':
            return {
                "success": False,
                "error": "No se pueden agregar productos a una cita completada."
            }
        
        product_id = int(data.get('product_id'))
        product = ProductRepository.get_product_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }
        
        existing = ServiceProductRepository.get_by_appointment_service_and_product(appointment_service_id, product_id)
        if existing:
            return {
                "success": False,
                "error": "Este producto ya está agregado a este servicio."
            }
        
        try:
            quantity = int(data.get('quantity_product', 1))
        except (TypeError, ValueError):
            return {
                "success": False,
                "error": "La cantidad del producto debe ser un numero entero valido."
            }

        if quantity <= 0:
            return {
                "success": False,
                "error": "La cantidad del producto debe ser mayor a cero."
            }

        reserved_quantity = AppointmentService._get_reserved_quantity_for_product(appointment_id, product_id)
        available_quantity = int(product.stock or 0) - reserved_quantity

        if quantity > available_quantity:
            return {
                "success": False,
                "error": (
                    f"Stock insuficiente para '{product.name}'. "
                    f"Disponible para esta cita: {max(available_quantity, 0)}, solicitado: {quantity}."
                )
            }
        
        service_product = ServiceProduct(
            appointment_service_id=appointment_service_id,
            product_id=product_id,
            quantity_product=quantity
        )
        
        created = ServiceProductRepository.create(service_product)
        
        return {
            "success": True,
            "data": {
                "id": created.id,
                "appointment_service_id": created.appointment_service_id,
                "product_id": created.product_id,
                "product_name": product.name,
                "quantity_product": created.quantity_product,
                "created_at": created.created_at.isoformat() if created.created_at else None
            }
        }
    
    @staticmethod
    def update_service_product(appointment_id, appointment_service_id, service_product_id, data):
        service_product = ServiceProductRepository.get_by_id(service_product_id)
        if not service_product or service_product.appointment_service_id != appointment_service_id:
            return {
                "success": False,
                "error": "Producto de servicio no encontrado."
            }
        
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        if 'quantity_product' in data:
            try:
                new_quantity = int(data['quantity_product'])
            except (TypeError, ValueError):
                return {
                    "success": False,
                    "error": "La cantidad del producto debe ser un numero entero valido."
                }

            if new_quantity <= 0:
                return {
                    "success": False,
                    "error": "La cantidad del producto debe ser mayor a cero."
                }

            product = ProductRepository.get_product_by_id(service_product.product_id)
            if not product:
                return {
                    "success": False,
                    "error": "Producto no encontrado o inactivo."
                }

            reserved_quantity = AppointmentService._get_reserved_quantity_for_product(
                appointment_id,
                service_product.product_id,
            )
            available_quantity = int(product.stock or 0) - (reserved_quantity - int(service_product.quantity_product or 0))

            if new_quantity > available_quantity:
                return {
                    "success": False,
                    "error": (
                        f"Stock insuficiente para '{product.name}'. "
                        f"Disponible para esta cita: {max(available_quantity, 0)}, solicitado: {new_quantity}."
                    )
                }

            service_product.quantity_product = new_quantity
        
        updated = ServiceProductRepository.update(service_product)
        
        return {
            "success": True,
            "data": {
                "id": updated.id,
                "appointment_service_id": updated.appointment_service_id,
                "product_id": updated.product_id,
                "product_name": updated.product.name,
                "quantity_product": updated.quantity_product,
                "updated_at": updated.updated_at.isoformat() if updated.updated_at else None
            }
        }
    
    @staticmethod
    def remove_product_from_service(appointment_id, appointment_service_id, service_product_id):
        service_product = ServiceProductRepository.get_by_id(service_product_id)
        if not service_product or service_product.appointment_service_id != appointment_service_id:
            return {
                "success": False,
                "error": "Producto de servicio no encontrado."
            }
        
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        ServiceProductRepository.delete(service_product)
        
        return {
            "success": True,
            "message": "Producto eliminado del servicio correctamente."
        }
    
    @staticmethod
    def get_service_products(appointment_id, appointment_service_id):
        appointment_service = AppointmentServiceRepository.get_by_id(appointment_service_id)
        if not appointment_service or appointment_service.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Servicio de cita no encontrado."
            }
        
        service_products = ServiceProductRepository.get_by_appointment_service_id(appointment_service_id)
        
        data = []
        for sp in service_products:
            product = sp.product
            data.append({
                "id": sp.id,
                "appointment_service_id": sp.appointment_service_id,
                "product_id": sp.product_id,
                "product_name": product.name if product else None,
                "quantity_product": sp.quantity_product,
                "created_at": sp.created_at.isoformat() if sp.created_at else None
            })
        
        return {
            "success": True,
            "data": data
        }
    
    
    @staticmethod
    def add_additional_to_appointment(appointment_id, data):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        
        if appointment.status == 'completed':
            return {
                "success": False,
                "error": "No se pueden agregar adicionales a una cita completada."
            }
        
        additional = Additional(
            appointment_id=appointment_id,
            concept=data.get('concept', ''),
            price=data.get('price', 0.0)
        )
        
        created = AdditionalRepository.create(additional)
        
        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def update_appointment_additional(appointment_id, additional_id, data):
        additional = AdditionalRepository.get_by_id(additional_id)
        if not additional or additional.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Adicional no encontrado."
            }
        
        if 'concept' in data:
            additional.concept = data['concept']
        if 'price' in data:
            additional.price = data['price']
        
        updated = AdditionalRepository.update(additional)
        
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def remove_additional_from_appointment(appointment_id, additional_id):
        additional = AdditionalRepository.get_by_id(additional_id)
        if not additional or additional.appointment_id != appointment_id:
            return {
                "success": False,
                "error": "Adicional no encontrado."
            }
        
        AdditionalRepository.delete(additional)
        
        return {
            "success": True,
            "message": "Adicional eliminado correctamente."
        }
    
    @staticmethod
    def get_appointment_additionals(appointment_id):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        
        additionals = AdditionalRepository.get_by_appointment_id(appointment_id)
        
        return {
            "success": True,
            "data": [additional.to_dict() for additional in additionals]
        }
    
    
    @staticmethod
    def get_appointment_summary(appointment_id):
        appointment = AppointmentRepository.get_by_id(appointment_id)
        if not appointment:
            return {
                "success": False,
                "error": "Cita no encontrada."
            }
        
        summary = appointment.to_dict()
        summary['client'] = {
            "id": appointment.client.id,
            "name": appointment.client.name,
            "phone": appointment.client.phone_number
        }
        summary['member'] = {
            "id": appointment.member.id,
            "name": f"{appointment.member.first_name} {appointment.member.last_name}"
        }
        
        appointment_services = AppointmentServiceRepository.get_by_appointment_id(appointment_id)
        services_data = []
        services_total = 0.0
        products_total = 0.0
        
        for appt_service in appointment_services:
            service = appt_service.service
            service_data = {
                "id": appt_service.id,
                "service_id": appt_service.service_id,
                "service_name": service.name if service else None,
                "price_applied": appt_service.price_applied,
                "products": []
            }
            
            services_total += appt_service.price_applied
            
            service_products = ServiceProductRepository.get_by_appointment_service_id(appt_service.id)
            for sp in service_products:
                product = sp.product
                product_price = product.price if product else 0.0
                product_subtotal = product_price * sp.quantity_product
                products_total += product_subtotal
                
                service_data["products"].append({
                    "id": sp.id,
                    "product_id": sp.product_id,
                    "product_name": product.name if product else None,
                    "quantity_product": sp.quantity_product
                })
            
            services_data.append(service_data)
        
        summary['services'] = services_data
        
        additionals = AdditionalRepository.get_by_appointment_id(appointment_id)
        additionals_data = [additional.to_dict() for additional in additionals]
        additionals_total = sum(additional.price for additional in additionals)
        
        summary['additionals'] = additionals_data
        
        summary['totals'] = {
            "services_total": services_total,
            "products_total": products_total,
            "additionals_total": additionals_total,
            "grand_total": services_total + products_total + additionals_total
        }
        
        return {
            "success": True,
            "data": summary
        }
