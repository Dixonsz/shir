import datetime
from app import db

#clientes del sistema.
#Cada cliente tiene información básica como nombre, correo electrónico y número de teléfono.
# Esta información es esencial para gestionar las citas y servicios asociados a cada cliente.

class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    number_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=True)
    photo_url = db.Column(db.String(500), nullable=True)
    photo_public_id = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    

    def to_dict(self):
        return {
            "id": self.id,
            "number_id": self.number_id,
            "name": self.name,
            "email": self.email,
            "phone_number": self.phone_number,
            "photo_url": self.photo_url,
            "photo_public_id": self.photo_public_id,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }