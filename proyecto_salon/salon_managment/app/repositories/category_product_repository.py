from app.models.category_product import CategoryProduct
from app import db

class CategoryProductRepository:

    @staticmethod
    def create(category_product):
        db.session.add(category_product)
        db.session.commit()
        return category_product
    
    @staticmethod
    def get_by_id(category_product_id):
        return CategoryProduct.query.filter_by(id=category_product_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return CategoryProduct.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(category_product):
        db.session.commit()
        return category_product
    
    @staticmethod
    def delete(category_product):
        category_product.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return CategoryProduct.query.filter_by(name=name, is_active=True).first()
