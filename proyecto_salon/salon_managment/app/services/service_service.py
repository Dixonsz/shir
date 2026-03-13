from app.models.service import Service
from app.repositories.service_repository import ServiceRepository
from app.repositories.category_service_repository import CategoryServiceRepository

class ServiceService:

    @staticmethod
    def create_service(data):
        if ServiceRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe un servicio con este nombre."
            }
        
        if not CategoryServiceRepository.get_by_id(data.get('category_service_id')):
            return {
                "success": False,
                "error": "Categoría de servicio no encontrada."
            }

        description = data.get('description')
        if description == '':
            description = None
        
        category_service_id = int(data['category_service_id']) if data.get('category_service_id') else None
        price = float(data['price']) if data.get('price') else 0.0
        duration_minutes = int(data['duration_minutes']) if data.get('duration_minutes') else 0

        service = Service(
            category_service_id=category_service_id,
            name=data['name'],
            description=description,
            price=price,
            duration_minutes=duration_minutes
        )

        created = ServiceRepository.create(service)

        return {
            "success": True,
            "data": created.to_dict()
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
    def get_all_services(include_promotions=False):
        services = ServiceRepository.get_all()
        return {
            "success": True,
            "data": [service.to_dict(include_promotions=include_promotions) for service in services] if services else []
        }
    
    @staticmethod
    def update_service(service_id, data):
        service = ServiceRepository.get_by_id(service_id)
        if not service:
            return {
                "success": False,
                "error": "Servicio no encontrado."
            }
        
        if 'category_service_id' in data and data['category_service_id']:
            service.category_service_id = int(data['category_service_id'])
        
        service.name = data.get('name', service.name)
        
        description = data.get('description', service.description)
        service.description = None if description == '' else description
        
        if 'price' in data:
            service.price = float(data['price']) if data['price'] else 0.0
        if 'duration_minutes' in data:
            service.duration_minutes = int(data['duration_minutes']) if data['duration_minutes'] else 0

        updated = ServiceRepository.update(service)
        return {
            "success": True,
            "data": updated.to_dict()
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
