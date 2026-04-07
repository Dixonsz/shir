import datetime
from app import db

# Cada promoción tiene detalles como tipo de descuento, valor, fechas de inicio y fin.

class Promotion(db.Model):
    __tablename__ = 'promotions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    discount_type = db.Column(db.String(50), nullable=False) 
    discount_value = db.Column(db.Float, nullable=False) 

    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False) 

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<Promotion {self.id}: {self.name}>'
    
    @property
    def is_valid(self):
        if not self.is_active:
            return False
        
        now = datetime.datetime.utcnow()
        return self.start_date <= now <= self.end_date
    
    def calculate_discount(self, original_price):
       
        if not self.is_valid:
            return original_price
        
        if self.discount_type == 'porcentual':
            discount_amount = original_price * (self.discount_value / 100)
            return original_price - discount_amount
        elif self.discount_type == 'fijo':
            return max(0, original_price - self.discount_value)
        
        return original_price

    def to_dict(self):
        linked_services = []
        for service_promotion in self.service_promotions or []:
            service = service_promotion.service
            if not service or not service.is_active:
                continue
            linked_services.append({
                "id": service.id,
                "name": service.name,
            })

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "is_active": self.is_active,
            "is_valid": self.is_valid,
            "service_ids": [service["id"] for service in linked_services],
            "services": linked_services,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }