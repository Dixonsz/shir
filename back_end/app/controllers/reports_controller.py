from flask import Blueprint, Response, jsonify, request

from app.services.reports_service import ReportsService


reports_bp = Blueprint('reports_bp', __name__, url_prefix='/api/reports')


def _get_filters():
    try:
        return ReportsService.parse_filters(request.args), None
    except ValueError as exc:
        return None, str(exc)


@reports_bp.route('/summary', methods=['GET'])
def get_summary():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_summary(
        from_date=filters['from_date'],
        to_date=filters['to_date'],
        status=filters['status'],
    )
    return jsonify(success=True, data=result['data']), 200


@reports_bp.route('/services', methods=['GET'])
def get_services():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_top_services(**filters)
    return jsonify(success=True, data=result['data'], meta=result['meta']), 200


@reports_bp.route('/products-related', methods=['GET'])
def get_products_related():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_products_related(**filters)
    return jsonify(success=True, data=result['data'], meta=result['meta']), 200


@reports_bp.route('/clients', methods=['GET'])
def get_clients():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_top_clients(**filters)
    return jsonify(success=True, data=result['data'], meta=result['meta']), 200


@reports_bp.route('/members', methods=['GET'])
def get_members():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_member_performance(**filters)
    return jsonify(success=True, data=result['data'], meta=result['meta']), 200


@reports_bp.route('/revenue-timeline', methods=['GET'])
def get_revenue_timeline():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    result = ReportsService.get_revenue_timeline(
        from_date=filters['from_date'],
        to_date=filters['to_date'],
        status=filters['status'],
    )
    return jsonify(success=True, data=result['data'], meta=result['meta']), 200


@reports_bp.route('/inventory', methods=['GET'])
def get_inventory():
    threshold = request.args.get('low_stock_threshold', default=5, type=int)
    if threshold < 0:
        return jsonify(success=False, message='low_stock_threshold no puede ser negativo.'), 400

    result = ReportsService.get_inventory(low_stock_threshold=threshold)
    return jsonify(success=True, data=result['data']), 200


@reports_bp.route('/export.csv', methods=['GET'])
def export_csv():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    report_type = request.args.get('report', default='services', type=str)

    try:
        result = ReportsService.build_export(
            report_type=report_type,
            format_type='csv',
            from_date=filters['from_date'],
            to_date=filters['to_date'],
            status=filters['status'],
            limit=filters['limit'],
        )
    except ValueError as exc:
        return jsonify(success=False, message=str(exc)), 400

    return Response(
        result['content'],
        mimetype=result['mimetype'],
        headers={
            'Content-Disposition': f'attachment; filename={result["filename"]}',
        },
    )


@reports_bp.route('/export', methods=['GET'])
def export_report():
    filters, error = _get_filters()
    if error:
        return jsonify(success=False, message=error), 400

    report_type = request.args.get('report', default='services', type=str)
    format_type = request.args.get('format', default='csv', type=str)

    try:
        result = ReportsService.build_export(
            report_type=report_type,
            format_type=format_type,
            from_date=filters['from_date'],
            to_date=filters['to_date'],
            status=filters['status'],
            limit=filters['limit'],
        )
    except ValueError as exc:
        return jsonify(success=False, message=str(exc)), 400

    return Response(
        result['content'],
        mimetype=result['mimetype'],
        headers={
            'Content-Disposition': f'attachment; filename={result["filename"]}',
        },
    )
