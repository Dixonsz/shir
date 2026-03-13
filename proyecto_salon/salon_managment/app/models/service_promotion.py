import datetime
from app import db

# Esta tabla intermedia permite vincular múltiples promociones a un servicio específico.
# Facilita la gestión de promociones aplicables a los servicios ofrecidos.

class ServicePromotion(db.Model):
    __tablename__ = 'service_promotions'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    promotion_id = db.Column(db.Integer, db.ForeignKey('promotions.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    service = db.relationship('Service', backref=db.backref('service_promotions', lazy=True))
    promotion = db.relationship('Promotion', backref=db.backref('service_promotions', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "service_id": self.service_id,
            "promotion_id": self.promotion_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }