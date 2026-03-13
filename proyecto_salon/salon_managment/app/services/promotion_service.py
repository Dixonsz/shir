from app.models.promotion import Promotion
from app.repositories.promotion_repository import PromotionRepository
from datetime import datetime

class PromotionService:

    @staticmethod
    def create_promotion(data):
        if PromotionRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe una promoción con este nombre."
            }

        discount_value = float(data['discount_value']) if data.get('discount_value') else 0.0
        
        start_date = None
        end_date = None
        
        if data.get('start_date'):
            try:
                start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
            except:
                start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
        
        if data.get('end_date'):
            try:
                end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
            except:
                end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')

        promotion = Promotion(
            name=data['name'],
            description=data.get('description') if data.get('description') else None,
            discount_type=data['discount_type'],
            discount_value=discount_value,
            start_date=start_date,
            end_date=end_date,
            is_active=data.get('is_active', True)
        )

        created = PromotionRepository.create(promotion)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_promotion_by_id(promotion_id):
        promotion = PromotionRepository.get_by_id(promotion_id)
        if not promotion:
            return {
                "success": False,
                "error": "Promoción no encontrada."
            }
        return {
            "success": True,
            "data": promotion.to_dict()
        }
    
    @staticmethod
    def get_all_promotions():
        promotions = PromotionRepository.get_all()
        return {
            "success": True,
            "data": [promotion.to_dict() for promotion in promotions] if promotions else []
        }
    
    @staticmethod
    def update_promotion(promotion_id, data):
        promotion = PromotionRepository.get_by_id(promotion_id)
        if not promotion:
            return {
                "success": False,
                "error": "Promoción no encontrada."
            }
        
        if 'discount_value' in data and data['discount_value'] is not None:
            promotion.discount_value = float(data['discount_value'])
        
        if data.get('start_date'):
            try:
                promotion.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
            except:
                promotion.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
        
        if data.get('end_date'):
            try:
                promotion.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
            except:
                promotion.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
        
        promotion.name = data.get('name', promotion.name)
        promotion.description = data.get('description') if data.get('description') else promotion.description
        promotion.discount_type = data.get('discount_type', promotion.discount_type)
        promotion.is_active = data.get('is_active', promotion.is_active)

        updated = PromotionRepository.update(promotion)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_promotion(promotion_id):
        promotion = PromotionRepository.get_by_id(promotion_id)
        if not promotion:
            return {
                "success": False,
                "error": "Promoción no encontrada."
            }
        PromotionRepository.delete(promotion)
        return {
            "success": True,
            "message": "Promoción eliminada correctamente."
        }
    
    @staticmethod
    def get_active_promotions():
        promotions = PromotionRepository.get_active_promotions()
        return {
            "success": True,
            "data": [promotion.to_dict() for promotion in promotions] if promotions else []
        }
