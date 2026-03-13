from app.services.promotion_service import PromotionService
from flask import Blueprint, request, jsonify

promotion_bp = Blueprint('promotion_bp', __name__, url_prefix='/api')

@promotion_bp.route('/promotions', methods=['POST'])
def create_promotion():
    result = PromotionService.create_promotion(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@promotion_bp.route('/promotions/<int:promotion_id>', methods=['GET'])
def get_promotion(promotion_id):
    result = PromotionService.get_promotion_by_id(promotion_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@promotion_bp.route('/promotions', methods=['GET'])
def get_all_promotions():
    result = PromotionService.get_all_promotions()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@promotion_bp.route('/promotions/<int:promotion_id>', methods=['PUT'])
def update_promotion(promotion_id):
    result = PromotionService.update_promotion(promotion_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@promotion_bp.route('/promotions/<int:promotion_id>', methods=['DELETE'])
def delete_promotion(promotion_id):
    result = PromotionService.delete_promotion(promotion_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@promotion_bp.route('/promotions/active', methods=['GET'])
def get_active_promotions():
    result = PromotionService.get_active_promotions()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200
