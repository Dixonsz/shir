import datetime
from app import db

# Galería de imágenes para la página de inicio (Landing)
# Cada imagen tiene título, descripción, URL y orden de visualización

class Gallery(db.Model):
    __tablename__ = 'gallery'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(500), nullable=False)
    image_public_id = db.Column(db.String(255), nullable=True)  # Para Cloudinary
    order = db.Column(db.Integer, default=0)  # Orden de visualización
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
            "image_public_id": self.image_public_id,
            "order": self.order,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
