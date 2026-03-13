from app.services.appointment_service import AppointmentService
from flask import Blueprint, request, jsonify

appointment_bp = Blueprint('appointment_bp', __name__, url_prefix='/api')

@appointment_bp.route('/appointments', methods=['POST'])
def create_appointment():
    result = AppointmentService.create_appointment(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    include_services = request.args.get('include_services', 'false').lower() == 'true'
    include_total = request.args.get('include_total', 'false').lower() == 'true'
    
    result = AppointmentService.get_appointment_by_id(
        appointment_id,
        include_services=include_services,
        include_total=include_total
    )
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@appointment_bp.route('/appointments', methods=['GET'])
def get_all_appointments():
    include_services = request.args.get('include_services', 'false').lower() == 'true'
    include_total = request.args.get('include_total', 'false').lower() == 'true'
    
    result = AppointmentService.get_all_appointments(
        include_services=include_services,
        include_total=include_total
    )
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    result = AppointmentService.update_appointment(appointment_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    result = AppointmentService.delete_appointment(appointment_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@appointment_bp.route('/appointments/client/<int:client_id>', methods=['GET'])
def get_appointments_by_client(client_id):
    result = AppointmentService.get_appointments_by_client(client_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@appointment_bp.route('/appointments/member/<int:member_id>', methods=['GET'])
def get_appointments_by_member(member_id):
    result = AppointmentService.get_appointments_by_member(member_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200



@appointment_bp.route('/appointments/<int:appointment_id>/services', methods=['POST'])
def add_service_to_appointment(appointment_id):
    """Agrega un servicio a una cita"""
    result = AppointmentService.add_service_to_appointment(appointment_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 201


@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>', methods=['PUT'])
def update_appointment_service(appointment_id, appointment_service_id):
    result = AppointmentService.update_appointment_service(appointment_id, appointment_service_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>', methods=['DELETE'])
def remove_service_from_appointment(appointment_id, appointment_service_id):
    result = AppointmentService.remove_service_from_appointment(appointment_id, appointment_service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/services', methods=['GET'])
def get_appointment_services(appointment_id):
    result = AppointmentService.get_appointment_services(appointment_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200



@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>/products', methods=['POST'])
def add_product_to_service(appointment_id, appointment_service_id):
    result = AppointmentService.add_product_to_service(appointment_id, appointment_service_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 201


@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>/products/<int:service_product_id>', methods=['PUT'])
def update_service_product(appointment_id, appointment_service_id, service_product_id):
    result = AppointmentService.update_service_product(appointment_id, appointment_service_id, service_product_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>/products/<int:service_product_id>', methods=['DELETE'])
def remove_product_from_service(appointment_id, appointment_service_id, service_product_id):
    result = AppointmentService.remove_product_from_service(appointment_id, appointment_service_id, service_product_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/services/<int:appointment_service_id>/products', methods=['GET'])
def get_service_products(appointment_id, appointment_service_id):
    result = AppointmentService.get_service_products(appointment_id, appointment_service_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200



@appointment_bp.route('/appointments/<int:appointment_id>/additionals', methods=['POST'])
def add_additional_to_appointment(appointment_id):
    result = AppointmentService.add_additional_to_appointment(appointment_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 201


@appointment_bp.route('/appointments/<int:appointment_id>/additionals/<int:additional_id>', methods=['PUT'])
def update_appointment_additional(appointment_id, additional_id):
    result = AppointmentService.update_appointment_additional(appointment_id, additional_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/additionals/<int:additional_id>', methods=['DELETE'])
def remove_additional_from_appointment(appointment_id, additional_id):
    result = AppointmentService.remove_additional_from_appointment(appointment_id, additional_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200


@appointment_bp.route('/appointments/<int:appointment_id>/additionals', methods=['GET'])
def get_appointment_additionals(appointment_id):
    result = AppointmentService.get_appointment_additionals(appointment_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200



@appointment_bp.route('/appointments/<int:appointment_id>/summary', methods=['GET'])
def get_appointment_summary(appointment_id):
    result = AppointmentService.get_appointment_summary(appointment_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200
