from app.repositories.product_repository import ProductRepository
from app.models.product import Product
from app import db

class ProductService:

    @staticmethod
    def _parse_price(value):
        if value in (None, ''):
            return 0.0
        return float(value)

    @staticmethod
    def _parse_stock(value):
        if value in (None, ''):
            return 0
        return int(value)

    @staticmethod
    def _parse_category_id(value):
        if value in (None, ''):
            return None
        return int(value)

    @staticmethod
    def create_product(data):
        if not isinstance(data, dict):
            return {
                "success": False,
                "error": "Datos invalidos para crear el producto."
            }

        if ProductRepository.get_product_by_id(data.get('product_id')):
            return {
                "success": False,
                "error": "Nombre de producto ya registrado."
            }

        description = data.get('description')
        if description == '':
            description = None
        
        try:
            category_product_id = ProductService._parse_category_id(data.get('category_product_id'))
            price = ProductService._parse_price(data.get('price'))
            stock = ProductService._parse_stock(data.get('stock'))
        except (TypeError, ValueError):
            return {
                "success": False,
                "error": "Formato invalido en precio, stock o categoria."
            }

        if not data.get('name'):
            return {
                "success": False,
                "error": "El nombre del producto es requerido."
            }

        product = Product(
            name=data['name'],
            description=description,
            price=price,
            stock=stock,
            category_product_id=category_product_id
        )

        try:
            created = ProductRepository.create(product)
        except Exception:
            db.session.rollback()
            return {
                "success": False,
                "error": "No fue posible crear el producto."
            }

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_product_by_id(product_id):
        product = ProductRepository.get_product_by_id(product_id)
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
        if not isinstance(data, dict):
            return {
                "success": False,
                "error": "Datos invalidos para actualizar el producto."
            }

        product = ProductRepository.get_product_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }

        product.name = data.get('name', product.name)
        
        description = data.get('description', product.description)
        product.description = None if description == '' else description
        
        try:
            if 'price' in data:
                product.price = ProductService._parse_price(data.get('price'))

            if 'stock' in data:
                product.stock = ProductService._parse_stock(data.get('stock'))

            if 'category_product_id' in data:
                parsed_category_id = ProductService._parse_category_id(data.get('category_product_id'))
                if parsed_category_id is not None:
                    product.category_product_id = parsed_category_id
        except (TypeError, ValueError):
            return {
                "success": False,
                "error": "Formato invalido en precio, stock o categoria."
            }

        try:
            updated = ProductRepository.update(product)
        except Exception:
            db.session.rollback()
            return {
                "success": False,
                "error": "No fue posible actualizar el producto."
            }

        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_product(product_id):
        product = ProductRepository.get_product_by_id(product_id)
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