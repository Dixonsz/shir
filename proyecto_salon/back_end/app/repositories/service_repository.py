from app.models.service import Service
from app import db

class ServiceRepository:

    @staticmethod
    def create(service):
        db.session.add(service)
        db.session.commit()
        return service
    
    @staticmethod
    def get_by_id(service_id):
        return Service.query.filter_by(id=service_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Service.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Service.id.asc() if order == 'asc' else Service.id.desc())
        elif order_by == 'name':
            query = query.order_by(Service.name.asc() if order == 'asc' else Service.name.desc())

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
    def update(service):
        db.session.commit()
        return service
    
    @staticmethod
    def delete(service):
        service.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return Service.query.filter_by(name=name, is_active=True).first()
    
    @staticmethod
    def get_by_category(category_service_id):
        return Service.query.filter_by(category_service_id=category_service_id, is_active=True).all()
