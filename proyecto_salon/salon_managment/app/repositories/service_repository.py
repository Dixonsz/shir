from app.models.service import Service
from app import db

class ServiceRepository:

    @staticmethod
    def create(service):
        db.session.add(service)
        db.session.commit()
        return service
    
    @staticmethod
    def get_by_id(service_id):
        return Service.query.filter_by(id=service_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Service.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(service):
        db.session.commit()
        return service
    
    @staticmethod
    def delete(service):
        service.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return Service.query.filter_by(name=name, is_active=True).first()
    
    @staticmethod
    def get_by_category(category_service_id):
        return Service.query.filter_by(category_service_id=category_service_id, is_active=True).all()
