from app.services.category_service_service import CategoryServiceService
from flask import Blueprint, request, jsonify

category_service_bp = Blueprint('category_service_bp', __name__, url_prefix='/api')

@category_service_bp.route('/category-services', methods=['POST'])
def create_category_service():
    result = CategoryServiceService.create_category_service(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@category_service_bp.route('/category-services/<int:category_service_id>', methods=['GET'])
def get_category_service(category_service_id):
    result = CategoryServiceService.get_category_service_by_id(category_service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_service_bp.route('/category-services', methods=['GET'])
def get_all_category_services():
    result = CategoryServiceService.get_all_category_services()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_service_bp.route('/category-services/<int:category_service_id>', methods=['PUT'])
def update_category_service(category_service_id):
    result = CategoryServiceService.update_category_service(category_service_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_service_bp.route('/category-services/<int:category_service_id>', methods=['DELETE'])
def delete_category_service(category_service_id):
    result = CategoryServiceService.delete_category_service(category_service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200
