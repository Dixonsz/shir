from app.models.marketing import Marketing
from app.repositories.marketing_repository import MarketingRepository
from app.repositories.promotion_repository import PromotionRepository
from datetime import datetime
import cloudinary.uploader
import re

class MarketingService:
    
    @staticmethod
    def _extract_public_id_from_url(url):
        if not url:
            return None
        try:
            match = re.search(r'/salon_marketing/([^/]+)\.[^.]+$', url)
            if match:
                return f"salon_marketing/{match.group(1)}"
            return None
        except Exception as e:
            print(f"Error extrayendo public_id: {str(e)}")
            return None
    
    @staticmethod
    def _delete_cloudinary_image(url):
        if not url:
            return
        try:
            public_id = MarketingService._extract_public_id_from_url(url)
            if public_id:
                result = cloudinary.uploader.destroy(public_id)
                print(f"Imagen eliminada de Cloudinary: {public_id}, resultado: {result}")
        except Exception as e:
            print(f"Error al eliminar imagen de Cloudinary: {str(e)}")

    @staticmethod
    def create_marketing(data):
        if MarketingRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe una campaña de marketing con este nombre."
            }
        
        if data.get('promotion_id') and not PromotionRepository.get_by_id(data.get('promotion_id')):
            return {
                "success": False,
                "error": "Promoción no encontrada."
            }

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and isinstance(start_date, str):
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                start_date = None
        
        if end_date and isinstance(end_date, str):
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                end_date = None

        marketing = Marketing(
            name=data['name'],
            description=data.get('description'),
            media_url=data.get('media_url'),
            promotion_id=data.get('promotion_id'),
            start_date=start_date,
            end_date=end_date
        )

        created = MarketingRepository.create(marketing)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_marketing_by_id(marketing_id):
        marketing = MarketingRepository.get_by_id(marketing_id)
        if not marketing:
            return {
                "success": False,
                "error": "Campaña de marketing no encontrada."
            }
        return {
            "success": True,
            "data": marketing.to_dict()
        }
    
    @staticmethod
    def get_all_marketing():
        marketing_campaigns = MarketingRepository.get_all()
        return {
            "success": True,
            "data": [marketing.to_dict() for marketing in marketing_campaigns] if marketing_campaigns else []
        }
    
    @staticmethod
    def update_marketing(marketing_id, data):
        marketing = MarketingRepository.get_by_id(marketing_id)
        if not marketing:
            return {
                "success": False,
                "error": "Campaña de marketing no encontrada."
            }
        
        if 'media_url' in data and data['media_url'] != marketing.media_url:
            if marketing.media_url:
                MarketingService._delete_cloudinary_image(marketing.media_url)
        
        if 'name' in data:
            marketing.name = data['name']
        if 'description' in data:
            marketing.description = data['description']
        if 'media_url' in data:
            marketing.media_url = data['media_url']
        if 'promotion_id' in data:
            marketing.promotion_id = data['promotion_id']
        
        if 'start_date' in data:
            start_date = data['start_date']
            if start_date and isinstance(start_date, str):
                try:
                    marketing.start_date = datetime.strptime(start_date, '%Y-%m-%d')
                except ValueError:
                    marketing.start_date = None
            else:
                marketing.start_date = start_date
        
        if 'end_date' in data:
            end_date = data['end_date']
            if end_date and isinstance(end_date, str):
                try:
                    marketing.end_date = datetime.strptime(end_date, '%Y-%m-%d')
                except ValueError:
                    marketing.end_date = None
            else:
                marketing.end_date = end_date

        updated = MarketingRepository.update(marketing)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_marketing(marketing_id):
        marketing = MarketingRepository.get_by_id(marketing_id)
        if not marketing:
            return {
                "success": False,
                "error": "Campaña de marketing no encontrada."
            }
        
        if marketing.media_url:
            MarketingService._delete_cloudinary_image(marketing.media_url)
        
        MarketingRepository.delete(marketing)
        return {
            "success": True,
            "message": "Campaña de marketing eliminada correctamente."
        }
    
    @staticmethod
    def get_active_campaigns():
        campaigns = MarketingRepository.get_active_campaigns()
        return {
            "success": True,
            "data": [campaign.to_dict() for campaign in campaigns] if campaigns else []
        }
    
    @staticmethod
    def get_marketing_by_promotion(promotion_id):
        campaigns = MarketingRepository.get_by_promotion(promotion_id)
        return {
            "success": True,
            "data": [campaign.to_dict() for campaign in campaigns] if campaigns else []
        }
