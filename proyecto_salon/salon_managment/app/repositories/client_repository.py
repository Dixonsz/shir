from app.models.client import Client
from app import db

class ClientRepository:

    @staticmethod
    def create(client):
        db.session.add(client)
        db.session.commit()
        return client
    
    @staticmethod
    def get_by_id(client_id):
        return Client.query.filter_by(id=client_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Client.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(client):
        db.session.commit()
        return client
    
    @staticmethod
    def delete(client):
        client.is_active = False
        
        for appointment in client.appointments:
            appointment.is_active = False
        
        db.session.commit()
    
    @staticmethod
    def hard_delete(client):
        db.session.delete(client)
        db.session.commit()
    
    @staticmethod
    def get_by_number_id(number_id):
        return Client.query.filter_by(number_id=number_id, is_active=True).first()