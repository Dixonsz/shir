import datetime
from app import db

# Cada servicio tiene información básica como nombre, categoría, descripción, precio y duración.
# Esta información es esencial para gestionar las citas y servicios ofrecidos a los clientes.

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    category_service_id = db.Column(db.Integer, db.ForeignKey('category_services.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    category_service = db.relationship('CategoryService', backref=db.backref('services', lazy=True))

    def get_price_with_promotion(self, promotion=None):
        if not promotion:
            return self.price
        
        return promotion.calculate_discount(self.price)
    
    def get_active_promotions(self):
        from app.models.service_promotion import ServicePromotion
        from app.models.promotion import Promotion
        
        service_promotions = ServicePromotion.query.filter_by(service_id=self.id).all()
        
        valid_promotions = []
        for sp in service_promotions:
            if sp.promotion and sp.promotion.is_valid:
                valid_promotions.append(sp.promotion)
        
        return valid_promotions

    def to_dict(self, include_promotions=False):
        data = {
            "id": self.id,
            "category_service_id": self.category_service_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "duration_minutes": self.duration_minutes,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
        
        if include_promotions:
            promotion_items = []
            for service_promotion in self.service_promotions or []:
                promotion = service_promotion.promotion
                if not promotion or not promotion.is_active:
                    continue

                promotion_items.append({
                    "id": promotion.id,
                    "name": promotion.name,
                    "description": promotion.description,
                    "discount_type": promotion.discount_type,
                    "discount_value": promotion.discount_value,
                    "start_date": promotion.start_date.isoformat() if promotion.start_date else None,
                    "end_date": promotion.end_date.isoformat() if promotion.end_date else None,
                    "is_active": promotion.is_active,
                    "is_valid": promotion.is_valid,
                })

            data["promotions"] = promotion_items

            active_promotions = self.get_active_promotions()
            if active_promotions:
                best_promotion = None
                best_price = self.price
                
                for promo in active_promotions:
                    discounted_price = self.get_price_with_promotion(promo)
                    if discounted_price < best_price:
                        best_price = discounted_price
                        best_promotion = promo
                
                if best_promotion:
                    data["promotion"] = {
                        "id": best_promotion.id,
                        "name": best_promotion.name,
                        "discount_type": best_promotion.discount_type,
                        "discount_value": best_promotion.discount_value
                    }
                    data["price_with_promotion"] = best_price
        
        return data