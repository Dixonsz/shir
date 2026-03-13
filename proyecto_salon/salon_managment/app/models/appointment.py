import datetime 
from app import db

# Citas programadas para clientes con miembros asignados.
# Cada cita tiene una fecha programada, un estado y está vinculada a un cliente y un miembro.
# Esto permite gestionar y organizar las citas dentro del sistema.

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='scheduled')
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    client = db.relationship('Client', backref=db.backref('appointments', lazy=True))
    member = db.relationship('Member', backref=db.backref('appointments', lazy=True))
    
    def get_services(self):
        from app.models.appointment_service import AppointmentService
        from app.models.service import Service
        
        appointment_services = AppointmentService.query.filter_by(
            appointment_id=self.id
        ).all()
        
        services = []
        for appt_service in appointment_services:
            if appt_service.service:
                services.append({
                    'service': appt_service.service,
                    'price_applied': appt_service.price_applied
                })
        
        return services
    
    @property
    def total_price(self):
        total = 0.0
        
        services = self.get_services()
        for item in services:
            total += item['price_applied']
        
        if hasattr(self, 'additionals'):
            for additional in self.additionals:
                total += additional.price
        
        return total
    
    def to_dict(self, include_services=False, include_total=False):
        data = {
            "id": self.id,
            "client_id": self.client_id,
            "member_id": self.member_id,
            "scheduled_date": self.scheduled_date.isoformat() if self.scheduled_date else None,
            "status": self.status,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_services:
            services = self.get_services()
            data["services"] = [{
                "service_id": s['service'].id,
                "service_name": s['service'].name,
                "price_applied": s['price_applied']
            } for s in services]
        
        if include_total:
            data["total_price"] = self.total_price
        
        return data