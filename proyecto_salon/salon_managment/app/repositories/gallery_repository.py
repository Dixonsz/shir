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
    def get_all(page=1, page_size=10, order='asc', order_by='order'):
        query = Gallery.query.filter_by(is_active=True)

        if order_by == 'order':
            query = query.order_by(Gallery.order.asc() if order == 'asc' else Gallery.order.desc())

        total = query.count()
        items = query.paginate(page=page, per_page=page_size, error_out=False).items

        return {
            "items": items,
            "total": total,
            "page": page,
            "pages": (total + page_size - 1) // page_size,
            "page_size": page_size
        }

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
