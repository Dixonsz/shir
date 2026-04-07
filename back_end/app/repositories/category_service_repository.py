from app.models.category_service import CategoryService
from app import db

class CategoryServiceRepository:

    @staticmethod
    def create(category_service):
        db.session.add(category_service)
        db.session.commit()
        return category_service
    
    @staticmethod
    def get_by_id(category_service_id):
        return CategoryService.query.filter_by(id=category_service_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = CategoryService.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(CategoryService.id.asc() if order == 'asc' else CategoryService.id.desc())
        elif order_by == 'name':
            query = query.order_by(CategoryService.name.asc() if order == 'asc' else CategoryService.name.desc())

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
    def update(category_service):
        db.session.commit()
        return category_service
    
    @staticmethod
    def delete(category_service):
        category_service.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return CategoryService.query.filter_by(name=name, is_active=True).first()
