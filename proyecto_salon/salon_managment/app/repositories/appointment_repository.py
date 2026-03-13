from app.models.appointment import Appointment
from app import db

class AppointmentRepository:

    @staticmethod
    def create(appointment):
        db.session.add(appointment)
        db.session.commit()
        return appointment
    
    @staticmethod
    def get_by_id(appointment_id):
        return Appointment.query.filter_by(id=appointment_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Appointment.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(appointment):
        db.session.commit()
        return appointment
    
    @staticmethod
    def delete(appointment):
        appointment.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_client_id(client_id):
        return Appointment.query.filter_by(client_id=client_id, is_active=True).all()
    
    @staticmethod
    def get_by_member_id(member_id):
        return Appointment.query.filter_by(member_id=member_id, is_active=True).all()
