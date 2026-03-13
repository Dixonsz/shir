from app.services.client_service import ClientService
from flask import Blueprint, request, jsonify

client_bp = Blueprint('client_bp', __name__, url_prefix='/api')

@client_bp.route('/clients', methods=['POST'])
def create_client():
    result = ClientService.create_client(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message="El número de identificación ya está en uso"
        ), 409

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@client_bp.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    result = ClientService.get_client_by_id(client_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@client_bp.route('/clients', methods=['GET'])
def get_all_clients():
    result = ClientService.get_all_clients()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@client_bp.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    result = ClientService.update_client(client_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@client_bp.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    result = ClientService.delete_client(client_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@client_bp.route('/clients/number_id/<string:number_id>', methods=['GET'])
def get_client_by_number_id(number_id):
    result = ClientService.get_client_by_number_id(number_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@client_bp.route('/clients/<int:client_id>/photo', methods=['POST'])
def upload_client_photo(client_id):
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
    
    result = ClientService.upload_photo(client_id, file)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404 if "no encontrado" in result["error"] else 500
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@client_bp.route('/clients/<int:client_id>/photo', methods=['DELETE'])
def delete_client_photo(client_id):
    result = ClientService.delete_photo(client_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200