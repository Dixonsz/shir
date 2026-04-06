from sqlalchemy import desc, func

from app import db
from app.models.appointment import Appointment
from app.models.appointment_service import AppointmentService
from app.models.client import Client
from app.models.member import Member
from app.models.product import Product
from app.models.service import Service
from app.models.service_product import ServiceProduct


class ReportRepository:
    @staticmethod
    def _apply_appointment_filters(query, from_date=None, to_date=None, status='completed'):
        query = query.filter(Appointment.is_active.is_(True))

        if status and status != 'all':
            query = query.filter(Appointment.status == status)

        if from_date is not None:
            query = query.filter(Appointment.scheduled_date >= from_date)

        if to_date is not None:
            query = query.filter(Appointment.scheduled_date <= to_date)

        return query

    @staticmethod
    def get_summary(from_date=None, to_date=None, status='completed'):
        summary_query = db.session.query(
            func.count(func.distinct(Appointment.id)).label('total_appointments'),
            func.coalesce(func.sum(AppointmentService.price_applied), 0).label('total_revenue'),
        ).outerjoin(
            AppointmentService,
            AppointmentService.appointment_id == Appointment.id,
        )

        summary_query = ReportRepository._apply_appointment_filters(
            summary_query,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )
        summary = summary_query.first()

        completed_query = db.session.query(
            func.count(func.distinct(Appointment.id)).label('completed_appointments')
        ).filter(
            Appointment.is_active.is_(True),
            Appointment.status == 'completed',
        )

        if from_date is not None:
            completed_query = completed_query.filter(Appointment.scheduled_date >= from_date)

        if to_date is not None:
            completed_query = completed_query.filter(Appointment.scheduled_date <= to_date)

        completed = completed_query.first()

        total_appointments = int(getattr(summary, 'total_appointments', 0) or 0)
        total_revenue = float(getattr(summary, 'total_revenue', 0) or 0)
        completed_appointments = int(getattr(completed, 'completed_appointments', 0) or 0)

        return {
            'total_appointments': total_appointments,
            'completed_appointments': completed_appointments,
            'total_revenue': total_revenue,
            'avg_appointment_value': (total_revenue / total_appointments) if total_appointments else 0.0,
        }

    @staticmethod
    def get_top_services(limit=10, from_date=None, to_date=None, status='completed'):
        query = db.session.query(
            Service.id.label('service_id'),
            Service.name.label('service_name'),
            func.count(AppointmentService.id).label('times_used'),
            func.coalesce(func.sum(AppointmentService.price_applied), 0).label('total_revenue'),
        ).join(
            AppointmentService,
            AppointmentService.service_id == Service.id,
        ).join(
            Appointment,
            Appointment.id == AppointmentService.appointment_id,
        ).filter(
            Service.is_active.is_(True)
        )

        query = ReportRepository._apply_appointment_filters(query, from_date, to_date, status)

        return query.group_by(
            Service.id,
            Service.name,
        ).order_by(
            desc('times_used'),
            desc('total_revenue'),
        ).limit(limit).all()

    @staticmethod
    def get_products_related(limit=10, from_date=None, to_date=None, status='completed'):
        query = db.session.query(
            Product.id.label('product_id'),
            Product.name.label('product_name'),
            Product.stock.label('stock'),
            Service.name.label('service_name'),
            func.coalesce(func.sum(ServiceProduct.quantity_product), 0).label('units_used'),
            func.coalesce(func.sum(ServiceProduct.quantity_product * Product.price), 0).label('revenue'),
        ).join(
            ServiceProduct,
            ServiceProduct.product_id == Product.id,
        ).join(
            AppointmentService,
            AppointmentService.id == ServiceProduct.appointment_service_id,
        ).join(
            Appointment,
            Appointment.id == AppointmentService.appointment_id,
        ).join(
            Service,
            Service.id == AppointmentService.service_id,
        ).filter(
            Product.is_active.is_(True),
            Service.is_active.is_(True),
        )

        query = ReportRepository._apply_appointment_filters(query, from_date, to_date, status)

        rows = query.group_by(
            Product.id,
            Product.name,
            Product.stock,
            Service.name,
        ).all()

        by_product = {}
        for row in rows:
            product_id = int(row.product_id)
            if product_id not in by_product:
                by_product[product_id] = {
                    'product_id': product_id,
                    'product_name': row.product_name,
                    'stock': int(row.stock or 0),
                    'units_used': 0,
                    'revenue': 0.0,
                    'related_services': set(),
                }

            by_product[product_id]['units_used'] += int(row.units_used or 0)
            by_product[product_id]['revenue'] += float(row.revenue or 0)
            if row.service_name:
                by_product[product_id]['related_services'].add(row.service_name)

        ordered = sorted(
            by_product.values(),
            key=lambda item: (item['units_used'], item['revenue']),
            reverse=True,
        )[:limit]

        for item in ordered:
            item['related_services'] = sorted(list(item['related_services']))

        return ordered

    @staticmethod
    def get_top_clients(limit=10, from_date=None, to_date=None, status='completed'):
        query = db.session.query(
            Client.id.label('client_id'),
            Client.name.label('client_name'),
            func.count(func.distinct(Appointment.id)).label('total_appointments'),
            func.coalesce(func.sum(AppointmentService.price_applied), 0).label('total_spent'),
            func.max(Appointment.scheduled_date).label('last_appointment'),
        ).join(
            Appointment,
            Appointment.client_id == Client.id,
        ).outerjoin(
            AppointmentService,
            AppointmentService.appointment_id == Appointment.id,
        ).filter(
            Client.is_active.is_(True)
        )

        query = ReportRepository._apply_appointment_filters(query, from_date, to_date, status)

        return query.group_by(
            Client.id,
            Client.name,
        ).order_by(
            desc('total_appointments'),
            desc('total_spent'),
        ).limit(limit).all()

    @staticmethod
    def get_member_performance(limit=10, from_date=None, to_date=None, status='completed'):
        query = db.session.query(
            Member.id.label('member_id'),
            Member.first_name.label('first_name'),
            Member.last_name.label('last_name'),
            func.count(func.distinct(Appointment.id)).label('total_appointments'),
            func.coalesce(func.sum(AppointmentService.price_applied), 0).label('total_revenue_generated'),
        ).join(
            Appointment,
            Appointment.member_id == Member.id,
        ).outerjoin(
            AppointmentService,
            AppointmentService.appointment_id == Appointment.id,
        ).filter(
            Member.is_active.is_(True)
        )

        query = ReportRepository._apply_appointment_filters(query, from_date, to_date, status)

        return query.group_by(
            Member.id,
            Member.first_name,
            Member.last_name,
        ).order_by(
            desc('total_appointments'),
            desc('total_revenue_generated'),
        ).limit(limit).all()

    @staticmethod
    def get_revenue_timeline(from_date=None, to_date=None, status='completed'):
        query = db.session.query(
            func.date(Appointment.scheduled_date).label('date_value'),
            func.coalesce(func.sum(AppointmentService.price_applied), 0).label('revenue'),
            func.count(func.distinct(Appointment.id)).label('appointments'),
        ).outerjoin(
            AppointmentService,
            AppointmentService.appointment_id == Appointment.id,
        )

        query = ReportRepository._apply_appointment_filters(query, from_date, to_date, status)

        return query.group_by(
            func.date(Appointment.scheduled_date),
        ).order_by(
            func.date(Appointment.scheduled_date).asc(),
        ).all()

    @staticmethod
    def get_inventory(low_stock_threshold=5):
        low_stock = Product.query.filter(
            Product.is_active.is_(True),
            Product.stock > 0,
            Product.stock <= low_stock_threshold,
        ).order_by(Product.stock.asc()).all()

        out_of_stock = Product.query.filter(
            Product.is_active.is_(True),
            Product.stock <= 0,
        ).order_by(Product.name.asc()).all()

        total_inventory_value = db.session.query(
            func.coalesce(func.sum(Product.stock * Product.price), 0)
        ).filter(Product.is_active.is_(True)).scalar() or 0

        return {
            'low_stock': low_stock,
            'out_of_stock': out_of_stock,
            'total_inventory_value': float(total_inventory_value),
        }
