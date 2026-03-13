from app.models.product import Product
from app import db

class ProductRepository:

    @staticmethod
    def create(product):
        db.session.add(product)
        db.session.commit()
        return product
    
    @staticmethod
    def get_product_by_id(product_id):
        return Product.query.filter_by(id=product_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Product.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(product):
        db.session.commit()
        return product
    
    @staticmethod
    def delete(product):
        product.is_active = False
        db.session.commit()

    @staticmethod
    def get_product_by_name(name):
        return Product.query.filter_by(name=name, is_active=True).first()