import datetime
from app import db

# Citas y servicios asociados.
# Una cita puede tener múltiples servicios asociados.
# Cada servicio asociado a una cita tiene un precio aplicado específico.
# Esto permite gestionar y detallar los servicios prestados en cada cita.


class AppointmentService(db.Model):
    __tablename__ = 'appointment_services'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    price_applied = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    appointment = db.relationship('Appointment', backref=db.backref('appointment_services', lazy=True))
    service = db.relationship('Service', backref=db.backref('appointment_services', lazy=True))
    
    def to_dict(self):
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "service_id": self.service_id,
            "price_applied": self.price_applied,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }