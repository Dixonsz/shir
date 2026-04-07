from app.models.promotion import Promotion
from app import db

class PromotionRepository:

    @staticmethod
    def create(promotion):
        db.session.add(promotion)
        db.session.commit()
        return promotion
    
    @staticmethod
    def get_by_id(promotion_id):
        return Promotion.query.filter_by(id=promotion_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Promotion.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Promotion.id.asc() if order == 'asc' else Promotion.id.desc())
        elif order_by == 'name':
            query = query.order_by(Promotion.name.asc() if order == 'asc' else Promotion.name.desc())

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
    def update(promotion):
        db.session.commit()
        return promotion
    
    @staticmethod
    def delete(promotion):
        promotion.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return Promotion.query.filter_by(name=name, is_active=True).first()
    
    @staticmethod
    def get_active_promotions():
        from datetime import datetime
        return Promotion.query.filter(
            Promotion.is_active == True,
            Promotion.start_date <= datetime.now(),
            Promotion.end_date >= datetime.now()
        ).all()
