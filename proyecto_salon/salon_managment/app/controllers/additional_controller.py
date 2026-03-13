from app.services.additional_service import AdditionalService
from flask import Blueprint, request, jsonify

additional_bp = Blueprint('additional_bp', __name__, url_prefix='/api')

@additional_bp.route('/additionals', methods=['POST'])
def create_additional():
    result = AdditionalService.create_additional(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@additional_bp.route('/additionals/<int:additional_id>', methods=['GET'])
def get_additional(additional_id):
    result = AdditionalService.get_additional_by_id(additional_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@additional_bp.route('/additionals', methods=['GET'])
def get_all_additionals():
    result = AdditionalService.get_all_additionals()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@additional_bp.route('/additionals/<int:additional_id>', methods=['PUT'])
def update_additional(additional_id):
    result = AdditionalService.update_additional(additional_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404

    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@additional_bp.route('/additionals/<int:additional_id>', methods=['DELETE'])
def delete_additional(additional_id):
    result = AdditionalService.delete_additional(additional_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

