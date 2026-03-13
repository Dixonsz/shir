from app.models.gallery import Gallery
from app import db

class GalleryRepository:

    @staticmethod
    def create(gallery):
        db.session.add(gallery)
        db.session.commit()
        return gallery
    
    @staticmethod
    def get_gallery_by_id(gallery_id):
        return Gallery.query.filter_by(id=gallery_id, is_active=True).first()
    
    @staticmethod
    def get_gallery_by_id_any_status(gallery_id):
        return Gallery.query.filter_by(id=gallery_id).first()
    
    @staticmethod
    def get_all():
        return Gallery.query.filter_by(is_active=True).order_by(Gallery.order.asc()).all()
    
    @staticmethod
    def get_all_active():
        return Gallery.query.filter_by(is_active=True).order_by(Gallery.order.asc()).all()
    
    @staticmethod
    def update(gallery):
        db.session.commit()
        return gallery
    
    @staticmethod
    def delete(gallery):
        gallery.is_active = False
        db.session.commit()
    
    @staticmethod
    def hard_delete(gallery):
        """Eliminación permanente de la base de datos"""
        db.session.delete(gallery)
        db.session.commit()
