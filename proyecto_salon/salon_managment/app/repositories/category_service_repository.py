from app.models.category_service import CategoryService
from app import db

class CategoryServiceRepository:

    @staticmethod
    def create(category_service):
        db.session.add(category_service)
        db.session.commit()
        return category_service
    
    @staticmethod
    def get_by_id(category_service_id):
        return CategoryService.query.filter_by(id=category_service_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return CategoryService.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(category_service):
        db.session.commit()
        return category_service
    
    @staticmethod
    def delete(category_service):
        category_service.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return CategoryService.query.filter_by(name=name, is_active=True).first()
