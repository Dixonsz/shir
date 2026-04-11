from app.models.service import Service
from app import db
from app.repositories.service_repository import ServiceRepository
from app.repositories.category_service_repository import CategoryServiceRepository

class ServiceService:

    @staticmethod
    def create_service(data):
        try:
            if not isinstance(data, dict):
                return {
                    "success": False,
                    "error": "Datos inválidos para crear servicio."
                }

            name = (data.get('name') or '').strip()
            if not name:
                return {
                    "success": False,
                    "error": "El nombre del servicio es obligatorio."
                }

            category_service_id_raw = data.get('category_service_id')
            if category_service_id_raw in (None, ''):
                return {
                    "success": False,
                    "error": "La categoría del servicio es obligatoria."
                }

            try:
                category_service_id = int(category_service_id_raw)
            except (TypeError, ValueError):
                return {
                    "success": False,
                    "error": "La categoría del servicio es inválida."
                }

            try:
                price = float(data.get('price'))
            except (TypeError, ValueError):
                return {
                    "success": False,
                    "error": "El precio es inválido."
                }

            try:
                duration_minutes = int(data.get('duration_minutes'))
            except (TypeError, ValueError):
                return {
                    "success": False,
                    "error": "La duración en minutos es inválida."
                }

            if ServiceRepository.get_by_name(name):
                return {
                    "success": False,
                    "error": "Ya existe un servicio con este nombre."
                }
            
            if not CategoryServiceRepository.get_by_id(category_service_id):
                return {
                    "success": False,
                    "error": "Categoría de servicio no encontrada."
                }

            description = data.get('description')
            if description == '':
                description = None
            
            service = Service(
                category_service_id=category_service_id,
                name=name,
                description=description,
                price=price,
                duration_minutes=duration_minutes
            )

            created = ServiceRepository.create(service)

            return {
                "success": True,
                "data": created.to_dict()
            }
        except Exception:
            db.session.rollback()
            return {
                "success": False,
                "error": "Ocurrió un error interno al crear el servicio."
            }
    
    @staticmethod
    def get_service_by_id(service_id, include_promotions=False):
        service = ServiceRepository.get_by_id(service_id)
        if not service:
            return {
                "success": False,
                "error": "Servicio no encontrado."
            }
        return {
            "success": True,
            "data": service.to_dict(include_promotions=include_promotions)
        }
    
    @staticmethod
    def get_all_services(include_promotions=False, page=1, page_size=10, order='desc', order_by='id'):
        result = ServiceRepository.get_all(page=page, page_size=page_size, order=order, order_by=order_by)
        return {
            "success": True,
            "data": [service.to_dict(include_promotions=include_promotions) for service in result["items"]] if result["items"] else [],
            "total": result["total"],
            "page": result["page"],
            "pages": result["pages"],
            "page_size": result["page_size"]
        }
    
    @staticmethod
    def update_service(service_id, data):
        try:
            if not isinstance(data, dict):
                return {
                    "success": False,
                    "error": "Datos inválidos para actualizar servicio."
                }

            service = ServiceRepository.get_by_id(service_id)
            if not service:
                return {
                    "success": False,
                    "error": "Servicio no encontrado."
                }
            
            if 'category_service_id' in data and data['category_service_id']:
                try:
                    category_service_id = int(data['category_service_id'])
                except (TypeError, ValueError):
                    return {
                        "success": False,
                        "error": "La categoría del servicio es inválida."
                    }

                if not CategoryServiceRepository.get_by_id(category_service_id):
                    return {
                        "success": False,
                        "error": "Categoría de servicio no encontrada."
                    }

                service.category_service_id = category_service_id
            
            service.name = data.get('name', service.name)
            
            description = data.get('description', service.description)
            service.description = None if description == '' else description
            
            if 'price' in data:
                try:
                    service.price = float(data['price']) if data['price'] else 0.0
                except (TypeError, ValueError):
                    return {
                        "success": False,
                        "error": "El precio es inválido."
                    }
            if 'duration_minutes' in data:
                try:
                    service.duration_minutes = int(data['duration_minutes']) if data['duration_minutes'] else 0
                except (TypeError, ValueError):
                    return {
                        "success": False,
                        "error": "La duración en minutos es inválida."
                    }

            updated = ServiceRepository.update(service)
            return {
                "success": True,
                "data": updated.to_dict()
            }
        except Exception:
            db.session.rollback()
            return {
                "success": False,
                "error": "Ocurrió un error interno al actualizar el servicio."
            }
    
    @staticmethod
    def delete_service(service_id):
        service = ServiceRepository.get_by_id(service_id)
        if not service:
            return {
                "success": False,
                "error": "Servicio no encontrado."
            }
        ServiceRepository.delete(service)
        return {
            "success": True,
            "message": "Servicio eliminado correctamente."
        }
    
    @staticmethod
    def get_services_by_category(category_service_id):
        services = ServiceRepository.get_by_category(category_service_id)
        return {
            "success": True,
            "data": [service.to_dict() for service in services] if services else []
        }
