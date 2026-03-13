from app.models.category_product import CategoryProduct
from app.repositories.category_product_repository import CategoryProductRepository

class CategoryProductService:

    @staticmethod
    def create_category_product(data):
        if CategoryProductRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe una categoría de producto con este nombre."
            }

        category_product = CategoryProduct(
            name=data['name'],
            description=data.get('description')
        )

        created = CategoryProductRepository.create(category_product)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_category_product_by_id(category_product_id):
        category_product = CategoryProductRepository.get_by_id(category_product_id)
        if not category_product:
            return {
                "success": False,
                "error": "Categoría de producto no encontrada."
            }
        return {
            "success": True,
            "data": category_product.to_dict()
        }
    
    @staticmethod
    def get_all_category_products():
        category_products = CategoryProductRepository.get_all()
        return {
            "success": True,
            "data": [category_product.to_dict() for category_product in category_products] if category_products else []
        }
    
    @staticmethod
    def update_category_product(category_product_id, data):
        category_product = CategoryProductRepository.get_by_id(category_product_id)
        if not category_product:
            return {
                "success": False,
                "error": "Categoría de producto no encontrada."
            }
        
        category_product.name = data.get('name', category_product.name)
        category_product.description = data.get('description', category_product.description)

        updated = CategoryProductRepository.update(category_product)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_category_product(category_product_id):
        category_product = CategoryProductRepository.get_by_id(category_product_id)
        if not category_product:
            return {
                "success": False,
                "error": "Categoría de producto no encontrada."
            }
        CategoryProductRepository.delete(category_product)
        return {
            "success": True,
            "message": "Categoría de producto eliminada correctamente."
        }
