from app.services.product_service import ProductService
from flask import Blueprint, request, jsonify

product_bp = Blueprint('product_bp', __name__, url_prefix='/api')

@product_bp.route('/products', methods=['POST'])
def create_product():
    result = ProductService.create_product(request.json)

    if not result["success"]:
        status_code = 409 if result["error"] == "Nombre de producto ya registrado." else 400
        return jsonify(
            success=False,
            message=result["error"]
        ), status_code

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    result = ProductService.get_product_by_id(product_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@product_bp.route('/products', methods=['GET'])
def get_all_products():
    result = ProductService.get_all_products()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    result = ProductService.update_product(product_id, request.json)
    
    if not result["success"]:
        status_code = 404 if result["error"] == "Producto no encontrado." else 400
        return jsonify(
            success=False,
            message=result["error"]
        ), status_code
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    result = ProductService.delete_product(product_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

