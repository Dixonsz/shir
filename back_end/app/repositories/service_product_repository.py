from app.models.service_product import ServiceProduct
from app import db

class ServiceProductRepository:

    @staticmethod
    def create(service_product):
        db.session.add(service_product)
        db.session.commit()
        return service_product
    
    @staticmethod
    def get_by_id(service_product_id):
        return ServiceProduct.query.filter_by(id=service_product_id).first()
    
    @staticmethod
    def get_by_appointment_service_id(appointment_service_id):
        return ServiceProduct.query.filter_by(appointment_service_id=appointment_service_id).all()
    
    @staticmethod
    def update(service_product):
        db.session.commit()
        return service_product
    
    @staticmethod
    def delete(service_product):
        db.session.delete(service_product)
        db.session.commit()
    
    @staticmethod
    def get_by_appointment_service_and_product(appointment_service_id, product_id):
        return ServiceProduct.query.filter_by(
            appointment_service_id=appointment_service_id,
            product_id=product_id
        ).first()
