from flask import Blueprint, jsonify, request
from app.services.rol_service import RolService

rol_bp = Blueprint('rol', __name__, url_prefix='/api')

@rol_bp.route('/roles', methods=['POST'])
def create_rol():
    result = RolService.create_rol(request.json)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 409
    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@rol_bp.route('/roles/<int:rol_id>', methods=['GET'])
def get_rol(rol_id):
    result = RolService.get_rol_by_id(rol_id)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@rol_bp.route('/roles', methods=['GET'])
def get_all_roles():
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    order = request.args.get('order', default='desc', type=str)
    order_by = request.args.get('order_by', default='id', type=str)
    result = RolService.get_all_roles(page, page_size, order, order_by)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"],
        total=result["total"],
        page=result["page"],
        pages=result["pages"],
        page_size=result["page_size"]
    ), 200

@rol_bp.route('/roles/<int:rol_id>', methods=['PUT'])
def update_rol(rol_id):
    result = RolService.update_rol(rol_id, request.json)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@rol_bp.route('/roles/<int:rol_id>', methods=['DELETE'])
def delete_rol(rol_id):
    result = RolService.delete_rol(rol_id)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        message=result["message"]
    ), 200


