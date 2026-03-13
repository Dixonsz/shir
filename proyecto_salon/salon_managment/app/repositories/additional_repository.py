from app.models.additional import Additional
from app import db

class AdditionalRepository:

    @staticmethod
    def create(additional):
        db.session.add(additional)
        db.session.commit()
        return additional
    
    @staticmethod
    def get_by_id(additional_id):
        return Additional.query.filter_by(id=additional_id).first()
    
    @staticmethod
    def get_all():
        return Additional.query.all()
    
    @staticmethod
    def get_by_appointment_id(appointment_id):
        return Additional.query.filter_by(appointment_id=appointment_id).all()
    
    @staticmethod
    def update(additional):
        db.session.commit()
        return additional
    
    @staticmethod
    def delete(additional):
        db.session.delete(additional)
        db.session.commit()