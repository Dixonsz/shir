from flask import Blueprint, jsonify,request
from app.services.member_service import MemberService

member_bp = Blueprint('member', __name__, url_prefix='/api')

@member_bp.route('/members', methods=['POST'])
def create_member():
    try:
        result = MemberService.create_member(request.json)
        if not result["success"]:
            return jsonify(
                success=False,
                message=result["error"]
            ), 409
        return jsonify(
            success=True,
            data=result["data"]
        ), 201
    except Exception as e:
        return jsonify(
            success=False,
            message=f"Error interno del servidor: {str(e)}"
        ), 500

@member_bp.route('/members/<int:member_id>', methods=['GET'])
def get_member(member_id):
    result = MemberService.get_member_by_id(member_id)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@member_bp.route('/members', methods=['GET'])
def get_all_members():
    result = MemberService.get_all_members()
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@member_bp.route('/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    result = MemberService.update_member(member_id, request.json)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@member_bp.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    result = MemberService.delete_member(member_id)
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@member_bp.route('/members/<int:member_id>/photo', methods=['POST'])
def upload_member_photo(member_id):
    if 'file' not in request.files:
        return jsonify(
            success=False,
            message="No se encontró archivo"
        ), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify(
            success=False,
            message="Archivo vacío"
        ), 400
    
    result = MemberService.upload_photo(member_id, file)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404 if "no encontrado" in result["error"] else 500
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@member_bp.route('/members/<int:member_id>/photo', methods=['DELETE'])
def delete_member_photo(member_id):
    result = MemberService.delete_photo(member_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200