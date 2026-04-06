import csv
from datetime import datetime, time
from io import StringIO

from app.repositories.report_repository import ReportRepository


class ReportsService:
    MAX_LIMIT = 100

    @staticmethod
    def _parse_iso_date(value, end_of_day=False):
        if not value:
            return None

        candidate = str(value).strip()
        if not candidate:
            return None

        try:
            if len(candidate) == 10:
                date_value = datetime.strptime(candidate, '%Y-%m-%d').date()
                if end_of_day:
                    return datetime.combine(date_value, time(23, 59, 59, 999999))
                return datetime.combine(date_value, time.min)

            parsed = datetime.fromisoformat(candidate.replace('Z', '+00:00'))
            if end_of_day and len(candidate) == 10:
                parsed = parsed.replace(hour=23, minute=59, second=59, microsecond=999999)
            return parsed
        except ValueError:
            raise ValueError('Formato de fecha invalido. Usa YYYY-MM-DD o ISO8601.')

    @staticmethod
    def _parse_limit(value):
        try:
            limit = int(value) if value is not None else 10
        except (TypeError, ValueError):
            raise ValueError('El parametro limit debe ser numerico.')

        if limit <= 0:
            raise ValueError('El parametro limit debe ser mayor a 0.')

        return min(limit, ReportsService.MAX_LIMIT)

    @staticmethod
    def _build_period(from_date, to_date):
        return {
            'from': from_date.isoformat() if from_date else None,
            'to': to_date.isoformat() if to_date else None,
        }

    @staticmethod
    def _build_status(status):
        normalized = (status or 'completed').strip().lower()
        if not normalized:
            return 'completed'
        return normalized

    @staticmethod
    def get_summary(from_date=None, to_date=None, status='completed'):
        payload = ReportRepository.get_summary(from_date=from_date, to_date=to_date, status=status)
        payload['period'] = ReportsService._build_period(from_date, to_date)
        payload['status_filter'] = status
        payload['total_revenue'] = round(float(payload['total_revenue']), 2)
        payload['avg_appointment_value'] = round(float(payload['avg_appointment_value']), 2)

        return {
            'success': True,
            'data': payload,
        }

    @staticmethod
    def get_top_services(limit=10, from_date=None, to_date=None, status='completed'):
        rows = ReportRepository.get_top_services(
            limit=limit,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )

        data = [
            {
                'service_id': int(row.service_id),
                'service_name': row.service_name,
                'times_used': int(row.times_used or 0),
                'total_revenue': round(float(row.total_revenue or 0), 2),
            }
            for row in rows
        ]

        return {
            'success': True,
            'data': data,
            'meta': {
                'period': ReportsService._build_period(from_date, to_date),
                'status_filter': status,
                'limit': limit,
            },
        }

    @staticmethod
    def get_products_related(limit=10, from_date=None, to_date=None, status='completed'):
        rows = ReportRepository.get_products_related(
            limit=limit,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )

        data = [
            {
                'product_id': row['product_id'],
                'product_name': row['product_name'],
                'units_used': int(row['units_used']),
                'revenue': round(float(row['revenue']), 2),
                'stock': int(row['stock']),
                'stock_status': 'out' if int(row['stock']) <= 0 else ('low' if int(row['stock']) <= 5 else 'ok'),
                'related_services': row['related_services'],
            }
            for row in rows
        ]

        return {
            'success': True,
            'data': data,
            'meta': {
                'period': ReportsService._build_period(from_date, to_date),
                'status_filter': status,
                'limit': limit,
            },
        }

    @staticmethod
    def get_top_clients(limit=10, from_date=None, to_date=None, status='completed'):
        rows = ReportRepository.get_top_clients(
            limit=limit,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )

        data = [
            {
                'client_id': int(row.client_id),
                'client_name': row.client_name,
                'total_appointments': int(row.total_appointments or 0),
                'total_spent': round(float(row.total_spent or 0), 2),
                'last_appointment': row.last_appointment.isoformat() if row.last_appointment else None,
            }
            for row in rows
        ]

        return {
            'success': True,
            'data': data,
            'meta': {
                'period': ReportsService._build_period(from_date, to_date),
                'status_filter': status,
                'limit': limit,
            },
        }

    @staticmethod
    def get_member_performance(limit=10, from_date=None, to_date=None, status='completed'):
        rows = ReportRepository.get_member_performance(
            limit=limit,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )

        data = []
        for row in rows:
            total_appointments = int(row.total_appointments or 0)
            total_revenue = float(row.total_revenue_generated or 0)
            full_name = f"{row.first_name or ''} {row.last_name or ''}".strip()
            data.append(
                {
                    'member_id': int(row.member_id),
                    'member_name': full_name,
                    'total_appointments': total_appointments,
                    'total_revenue_generated': round(total_revenue, 2),
                    'avg_ticket': round((total_revenue / total_appointments), 2) if total_appointments else 0,
                }
            )

        return {
            'success': True,
            'data': data,
            'meta': {
                'period': ReportsService._build_period(from_date, to_date),
                'status_filter': status,
                'limit': limit,
            },
        }

    @staticmethod
    def get_revenue_timeline(from_date=None, to_date=None, status='completed'):
        rows = ReportRepository.get_revenue_timeline(
            from_date=from_date,
            to_date=to_date,
            status=status,
        )

        data = [
            {
                'date': str(row.date_value),
                'revenue': round(float(row.revenue or 0), 2),
                'appointments': int(row.appointments or 0),
            }
            for row in rows
        ]

        return {
            'success': True,
            'data': data,
            'meta': {
                'period': ReportsService._build_period(from_date, to_date),
                'status_filter': status,
            },
        }

    @staticmethod
    def get_inventory(low_stock_threshold=5):
        inventory = ReportRepository.get_inventory(low_stock_threshold=low_stock_threshold)

        data = {
            'low_stock': [
                {
                    'id': product.id,
                    'name': product.name,
                    'stock': product.stock,
                }
                for product in inventory['low_stock']
            ],
            'out_of_stock': [
                {
                    'id': product.id,
                    'name': product.name,
                    'stock': product.stock,
                }
                for product in inventory['out_of_stock']
            ],
            'total_inventory_value': round(float(inventory['total_inventory_value']), 2),
            'threshold': low_stock_threshold,
        }

        return {
            'success': True,
            'data': data,
        }

    @staticmethod
    def build_csv(report_type, from_date=None, to_date=None, status='completed', limit=10):
        report_type = (report_type or '').strip().lower()

        if report_type == 'services':
            result = ReportsService.get_top_services(limit=limit, from_date=from_date, to_date=to_date, status=status)
            headers = ['service_id', 'service_name', 'times_used', 'total_revenue']
            rows = result['data']
        elif report_type == 'products':
            result = ReportsService.get_products_related(limit=limit, from_date=from_date, to_date=to_date, status=status)
            headers = ['product_id', 'product_name', 'units_used', 'revenue', 'stock', 'stock_status', 'related_services']
            rows = [
                {
                    **row,
                    'related_services': ', '.join(row.get('related_services', [])),
                }
                for row in result['data']
            ]
        elif report_type == 'clients':
            result = ReportsService.get_top_clients(limit=limit, from_date=from_date, to_date=to_date, status=status)
            headers = ['client_id', 'client_name', 'total_appointments', 'total_spent', 'last_appointment']
            rows = result['data']
        elif report_type == 'members':
            result = ReportsService.get_member_performance(limit=limit, from_date=from_date, to_date=to_date, status=status)
            headers = ['member_id', 'member_name', 'total_appointments', 'total_revenue_generated', 'avg_ticket']
            rows = result['data']
        elif report_type == 'revenue':
            result = ReportsService.get_revenue_timeline(from_date=from_date, to_date=to_date, status=status)
            headers = ['date', 'revenue', 'appointments']
            rows = result['data']
        else:
            raise ValueError('Tipo de reporte no soportado para exportacion CSV.')

        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

        return {
            'success': True,
            'csv': output.getvalue(),
            'filename': f'reporte_{report_type}.csv',
        }

    @staticmethod
    def parse_filters(args):
        from_date = ReportsService._parse_iso_date(args.get('from_date'))
        to_date = ReportsService._parse_iso_date(args.get('to_date'), end_of_day=True)
        status = ReportsService._build_status(args.get('status'))
        limit = ReportsService._parse_limit(args.get('limit'))

        return {
            'from_date': from_date,
            'to_date': to_date,
            'status': status,
            'limit': limit,
        }
