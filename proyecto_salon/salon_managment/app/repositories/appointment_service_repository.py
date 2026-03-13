from app.models.appointment_service import AppointmentService
from app import db

class AppointmentServiceRepository:

    @staticmethod
    def create(appointment_service):
        db.session.add(appointment_service)
        db.session.commit()
        return appointment_service
    
    @staticmethod
    def get_by_id(appointment_service_id):
        return AppointmentService.query.filter_by(id=appointment_service_id).first()
    
    @staticmethod
    def get_by_appointment_id(appointment_id):
        return AppointmentService.query.filter_by(appointment_id=appointment_id).all()
    
    @staticmethod
    def update(appointment_service):
        db.session.commit()
        return appointment_service
    
    @staticmethod
    def delete(appointment_service):
        db.session.delete(appointment_service)
        db.session.commit()
    
    @staticmethod
    def get_by_appointment_and_service(appointment_id, service_id):
        return AppointmentService.query.filter_by(
            appointment_id=appointment_id,
            service_id=service_id
        ).first()
