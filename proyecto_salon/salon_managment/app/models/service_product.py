import datetime
from app import db

# Esta tabla intermedia permite vincular productos específicos a los servicios prestados durante una cita.
# Cada registro indica qué producto fue utilizado en un servicio particular y en qué cantidad.

class ServiceProduct(db.Model):
    __tablename__ = 'service_products'

    id = db.Column(db.Integer, primary_key=True)
    appointment_service_id = db.Column(db.Integer, db.ForeignKey('appointment_services.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_product = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    appointment_service = db.relationship('AppointmentService', backref=db.backref('service_products', lazy=True))
    product = db.relationship('Product', backref=db.backref('service_products', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "appointment_service_id": self.appointment_service_id,
            "product_id": self.product_id,
            "quantity_product": self.quantity_product,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }