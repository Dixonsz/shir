from app.models.marketing import Marketing
from app import db

class MarketingRepository:

    @staticmethod
    def create(marketing):
        db.session.add(marketing)
        db.session.commit()
        return marketing
    
    @staticmethod
    def get_by_id(marketing_id):
        return Marketing.query.filter_by(id=marketing_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Marketing.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Marketing.id.asc() if order == 'asc' else Marketing.id.desc())
        elif order_by == 'name':
            query = query.order_by(Marketing.name.asc() if order == 'asc' else Marketing.name.desc())

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
    def update(marketing):
        db.session.commit()
        return marketing
    
    @staticmethod
    def delete(marketing):
        marketing.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return Marketing.query.filter_by(name=name, is_active=True).first()
    
    @staticmethod
    def get_active_campaigns():
        from datetime import datetime
        return Marketing.query.filter(
            Marketing.is_active == True,
            Marketing.start_date <= datetime.now(),
            db.or_(Marketing.end_date.is_(None), Marketing.end_date >= datetime.now())
        ).all()
    
    @staticmethod
    def get_by_promotion(promotion_id):
        return Marketing.query.filter_by(promotion_id=promotion_id, is_active=True).all()
