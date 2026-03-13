from app.models.rol import Rol
from app import db

class RolRepository:

    @staticmethod
    def create(rol):
        db.session.add(rol)
        db.session.commit()
        return rol
    
    @staticmethod
    def get_by_id(rol_id):
        return Rol.query.filter_by(id=rol_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Rol.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(rol):
        db.session.commit()
        return rol
    
    @staticmethod
    def delete(rol):
        rol.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return Rol.query.filter_by(name=name, is_active=True).first()