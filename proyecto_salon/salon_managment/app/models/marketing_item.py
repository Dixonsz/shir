import datetime
from app import db

# elementos de marketing.
# Estos elementos pueden estar asociados a productos o servicios específicos.
# Permiten gestionar promociones y ofertas dentro del sistema de marketing.
# Facilitan la implementación de estrategias de marketing dirigidas a productos o servicios específicos.

class MarketingItem(db.Model):
    __tablename__ = 'marketing_items'

    id = db.Column(db.Integer, primary_key=True)
    marketing_id = db.Column(db.Integer, db.ForeignKey('marketing.id'), nullable=False)
    item_type = db.Column(db.String(100), nullable=False) 

    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)

    price_promotion = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    marketing = db.relationship('Marketing', backref=db.backref('marketing_items', lazy=True))
    service = db.relationship('Service', backref=db.backref('marketing_items', lazy=True), foreign_keys=[service_id])
    product = db.relationship('Product', backref=db.backref('marketing_items', lazy=True), foreign_keys=[product_id])

    def to_dict(self):
        return {
            "id": self.id,
            "marketing_id": self.marketing_id,
            "item_type": self.item_type,
            "service_id": self.service_id,
            "product_id": self.product_id,
            "price_promotion": self.price_promotion,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
    
    