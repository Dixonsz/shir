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
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Rol.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Rol.id.asc() if order == 'asc' else Rol.id.desc())
        elif order_by == 'name':
            query = query.order_by(Rol.name.asc() if order == 'asc' else Rol.name.desc())

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