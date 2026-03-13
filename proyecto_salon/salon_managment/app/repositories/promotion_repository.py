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
    def get_all():
        return Promotion.query.filter_by(is_active=True).all()
    
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
