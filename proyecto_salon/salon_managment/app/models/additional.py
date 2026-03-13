import datetime
from app import db

#Son elementos adicionales que se pueden agregar a una cita, como servicios extra o productos adicionales.
#Estos elementos tienen un concepto descriptivo y un precio asociado.
#Puede haber múltiples elementos adicionales vinculados a una sola cita.
#Estos elementos permiten personalizar y ampliar los servicios ofrecidos en una cita.

class Additional(db.Model):
    __tablename__ = 'additionals'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    concept = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    appointment = db.relationship('Appointment', backref=db.backref('additionals', lazy=True))
    
    def to_dict(self):
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "concept": self.concept,
            "price": self.price,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }