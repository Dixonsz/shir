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
    def get_all():
        return Marketing.query.filter_by(is_active=True).all()
    
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
