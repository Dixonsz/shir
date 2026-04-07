from app.models.category_service import CategoryService
from app.repositories.category_service_repository import CategoryServiceRepository

class CategoryServiceService:

    @staticmethod
    def create_category_service(data):
        if CategoryServiceRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe una categoría de servicio con este nombre."
            }

        category_service = CategoryService(
            name=data['name'],
            description=data.get('description')
        )

        created = CategoryServiceRepository.create(category_service)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_category_service_by_id(category_service_id):
        category_service = CategoryServiceRepository.get_by_id(category_service_id)
        if not category_service:
            return {
                "success": False,
                "error": "Categoría de servicio no encontrada."
            }
        return {
            "success": True,
            "data": category_service.to_dict()
        }
    
    @staticmethod
    def get_all_category_services( page=1, page_size=10, order='desc', order_by='id'):
        result = CategoryServiceRepository.get_all(page=page, page_size=page_size, order=order, order_by=order_by)
        return {
            "success": True,
            "data": [category_service.to_dict() for category_service in result["items"]] if result["items"] else [],
            "total": result["total"],
            "page": result["page"],
            "pages": result["pages"],
            "page_size": result["page_size"]
        }
    
    @staticmethod
    def update_category_service(category_service_id, data):
        category_service = CategoryServiceRepository.get_by_id(category_service_id)
        if not category_service:
            return {
                "success": False,
                "error": "Categoría de servicio no encontrada."
            }
        
        category_service.name = data.get('name', category_service.name)
        category_service.description = data.get('description', category_service.description)

        updated = CategoryServiceRepository.update(category_service)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_category_service(category_service_id):
        category_service = CategoryServiceRepository.get_by_id(category_service_id)
        if not category_service:
            return {
                "success": False,
                "error": "Categoría de servicio no encontrada."
            }
        CategoryServiceRepository.delete(category_service)
        return {
            "success": True,
            "message": "Categoría de servicio eliminada correctamente."
        }
