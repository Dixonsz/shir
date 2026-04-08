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
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    order = request.args.get('order', default='desc', type=str)
    order_by = request.args.get('order_by', default='id', type=str)
    result = ProductService.get_all_products(page, page_size, order, order_by)
    
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


@product_bp.route('/products/<int:product_id>/stock-in', methods=['POST'])
def add_product_stock(product_id):
    result = ProductService.add_stock(product_id, request.json)

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


@product_bp.route('/products/<int:product_id>/stock-movements', methods=['GET'])
def get_product_stock_movements(product_id):
    result = ProductService.get_stock_movements(product_id)

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

