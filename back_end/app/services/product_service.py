from app.repositories.product_repository import ProductRepository
from app.repositories.product_stock_movement_repository import ProductStockMovementRepository
from app.models.product import Product
from app.models.product_stock_movement import ProductStockMovement
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
    def get_all_products( page=1, page_size=10, order='desc', order_by='id'):
        result = ProductRepository.get_all(page=page, page_size=page_size, order=order, order_by=order_by)
        return {
            "success": True,
            "data": [product.to_dict() for product in result["items"]] if result["items"] else [],
            "total": result["total"],
            "page": result["page"],
            "pages": result["pages"],
            "page_size": result["page_size"]
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
            parsed_price = ProductService._parse_price(data.get('price')) if 'price' in data else None
            parsed_stock = ProductService._parse_stock(data.get('stock')) if 'stock' in data else None

            if 'price' in data and 'stock' in data and parsed_stock > product.stock and product.stock > 0:
                # Si entra nuevo stock con otro precio, calcula precio promedio ponderado
                # para no impactar retroactivamente el valor de unidades anteriores.
                added_units = parsed_stock - product.stock
                weighted_price = ((product.stock * product.price) + (added_units * parsed_price)) / parsed_stock
                product.price = round(weighted_price, 2)
            elif 'price' in data:
                product.price = parsed_price

            if 'stock' in data:
                product.stock = parsed_stock

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

    @staticmethod
    def add_stock(product_id, data):
        if not isinstance(data, dict):
            return {
                "success": False,
                "error": "Datos invalidos para ingreso de stock."
            }

        product = ProductRepository.get_product_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }

        try:
            quantity = ProductService._parse_stock(data.get('quantity'))
            purchase_price = data.get('purchase_price')
            purchase_price = ProductService._parse_price(purchase_price) if purchase_price not in (None, '') else None
            update_sale_price = bool(data.get('update_sale_price', False))
            new_sale_price = data.get('new_sale_price')
            parsed_sale_price = ProductService._parse_price(new_sale_price) if new_sale_price not in (None, '') else None
        except (TypeError, ValueError):
            return {
                "success": False,
                "error": "Formato invalido en cantidad o precios."
            }

        if quantity <= 0:
            return {
                "success": False,
                "error": "La cantidad a ingresar debe ser mayor a cero."
            }

        if purchase_price is not None and purchase_price < 0:
            return {
                "success": False,
                "error": "El precio de compra no puede ser negativo."
            }

        if update_sale_price and parsed_sale_price is None:
            return {
                "success": False,
                "error": "Debe indicar new_sale_price cuando update_sale_price es true."
            }

        if parsed_sale_price is not None and parsed_sale_price < 0:
            return {
                "success": False,
                "error": "El precio de venta no puede ser negativo."
            }

        previous_stock = int(product.stock or 0)
        product.stock = previous_stock + quantity

        if update_sale_price and parsed_sale_price is not None:
            product.price = parsed_sale_price

        movement = ProductStockMovement(
            product_id=product.id,
            movement_type='in',
            quantity=quantity,
            stock_before=previous_stock,
            stock_after=product.stock,
            purchase_price=purchase_price,
            notes=data.get('notes')
        )

        try:
            db.session.add(movement)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {
                "success": False,
                "error": "No fue posible registrar el ingreso de stock."
            }

        return {
            "success": True,
            "data": {
                "product": product.to_dict(),
                "movement": movement.to_dict()
            }
        }

    @staticmethod
    def get_stock_movements(product_id):
        product = ProductRepository.get_product_by_id(product_id)
        if not product:
            return {
                "success": False,
                "error": "Producto no encontrado."
            }

        movements = ProductStockMovementRepository.get_by_product_id(product_id)
        return {
            "success": True,
            "data": [movement.to_dict() for movement in movements]
        }