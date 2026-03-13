from app.services.service_service import ServiceService
from flask import Blueprint, request, jsonify

service_bp = Blueprint('service_bp', __name__, url_prefix='/api')

@service_bp.route('/services', methods=['POST'])
def create_service():
    result = ServiceService.create_service(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@service_bp.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    include_promotions = request.args.get('include_promotions', 'false').lower() == 'true'
    
    result = ServiceService.get_service_by_id(service_id, include_promotions=include_promotions)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@service_bp.route('/services', methods=['GET'])
def get_all_services():
    include_promotions = request.args.get('include_promotions', 'false').lower() == 'true'
    
    result = ServiceService.get_all_services(include_promotions=include_promotions)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@service_bp.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    result = ServiceService.update_service(service_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@service_bp.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    result = ServiceService.delete_service(service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@service_bp.route('/services/category/<int:category_service_id>', methods=['GET'])
def get_services_by_category(category_service_id):
    result = ServiceService.get_services_by_category(category_service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200
