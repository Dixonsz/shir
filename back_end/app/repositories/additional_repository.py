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
    def get_all( page=1, page_size=10, order='desc', order_by='id'):
        query = Additional.query.filter_by(is_active=True)
        
        if order_by == 'id':
            query = query.order_by(Additional.id.asc() if order == 'asc' else Additional.id.desc())
        elif order_by == 'name':
            query = query.order_by(Additional.name.asc() if order == 'asc' else Additional.name.desc())

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