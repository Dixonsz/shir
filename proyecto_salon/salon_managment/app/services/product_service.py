from app.repositories.product_repository import ProductRepository
from app.models.product import Product

class ProductService:

    @staticmethod
    def create_product(data):
        if ProductRepository.get_product_by_id(data.get('product_id')):
            return {
                "success": False,
                "error": "Nombre de producto ya registrado."
            }

        description = data.get('description')
        if description == '':
            description = None
        
        category_product_id = int(data['category_product_id']) if data.get('category_product_id') else None
        
        price = float(data['price']) if data.get('price') else 0.0
        stock = int(data['stock']) if data.get('stock') else 0

        product = Product(
            name=data['name'],
            description=description,
            price=price,
            stock=stock,
            category_product_id=category_product_id
        )

        created = ProductRepository.create(product)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_product_by_id(product_id):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }
        return {
            "success": True,
            "data": product.to_dict()
        }
    
    @staticmethod
    def get_all_products():
        products = ProductRepository.get_all()
        return {
            "success": True,
            "data": [product.to_dict() for product in products] if products else []
        }
    
    @staticmethod
    def update_product(product_id, data):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }

        product.name = data.get('name', product.name)
        
        description = data.get('description', product.description)
        product.description = None if description == '' else description
        
        if 'price' in data:
            product.price = float(data['price']) if data['price'] else 0.0
        if 'stock' in data:
            product.stock = int(data['stock']) if data['stock'] else 0
        
        if 'category_product_id' in data and data['category_product_id']:
            product.category_product_id = int(data['category_product_id'])

        updated = ProductRepository.update(product)

        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_product(product_id):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }
        ProductRepository.delete(product)
        return {
            "success": True,
            "message": "Producto eliminado correctamente."
        }
    
    @staticmethod
    def get_product_by_name(name):
        product = ProductRepository.get_product_by_name(name)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }
        return {
            "success": True,
            "data": product.to_dict()
        }