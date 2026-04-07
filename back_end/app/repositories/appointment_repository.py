from app.models.appointment import Appointment
from app import db

class AppointmentRepository:

    @staticmethod
    def create(appointment):
        db.session.add(appointment)
        db.session.commit()
        return appointment
    
    @staticmethod
    def get_by_id(appointment_id):
        return Appointment.query.filter_by(id=appointment_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Appointment.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Appointment.id.asc() if order == 'asc' else Appointment.id.desc())
        elif order_by == 'scheduled_date':
            query = query.order_by(Appointment.scheduled_date.asc() if order == 'asc' else Appointment.scheduled_date.desc())

        total = query.count()
        items = query.paginate(page=page, per_page=page_size, error_out=False).items

        return {
            "items": items,
            "total": total,
            "page": page,
            "pages": (total + page_size - 1) // page_size,
            "page_size": page_size
        }

    @staticmethod
    def update(appointment):
        db.session.commit()
        return appointment
    
    @staticmethod
    def delete(appointment):
        appointment.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_client_id(client_id):
        return Appointment.query.filter_by(client_id=client_id, is_active=True).all()
    
    @staticmethod
    def get_by_member_id(member_id):
        return Appointment.query.filter_by(member_id=member_id, is_active=True).all()
