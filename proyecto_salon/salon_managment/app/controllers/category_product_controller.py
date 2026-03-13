from app.services.category_product_service import CategoryProductService
from flask import Blueprint, request, jsonify

category_product_bp = Blueprint('category_product_bp', __name__, url_prefix='/api')

@category_product_bp.route('/category-products', methods=['POST'])
def create_category_product():
    result = CategoryProductService.create_category_product(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@category_product_bp.route('/category-products/<int:category_product_id>', methods=['GET'])
def get_category_product(category_product_id):
    result = CategoryProductService.get_category_product_by_id(category_product_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_product_bp.route('/category-products', methods=['GET'])
def get_all_category_products():
    result = CategoryProductService.get_all_category_products()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_product_bp.route('/category-products/<int:category_product_id>', methods=['PUT'])
def update_category_product(category_product_id):
    result = CategoryProductService.update_category_product(category_product_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@category_product_bp.route('/category-products/<int:category_product_id>', methods=['DELETE'])
def delete_category_product(category_product_id):
    result = CategoryProductService.delete_category_product(category_product_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200
