from app.repositories.additional_repository import AdditionalRepository
from app.models.additional import Additional

class AdditionalService:

    @staticmethod
    def create_additional(data):
        price = float(data['price']) if data.get('price') else 0.0
        appointment_id = int(data['appointment_id']) if data.get('appointment_id') else None
        
        additional = Additional(
            appointment_id=appointment_id,
            concept=data.get('concept'),
            price=price
        )

        created = AdditionalRepository.create(additional)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_additional_by_id(additional_id):
        additional = AdditionalRepository.get_by_id(additional_id)
        if not additional:
            return {
                "success": False,
                "error": "Servicio adicional no encontrado."
            }
        return {
            "success": True,
            "data": additional.to_dict()
        }
    
    @staticmethod
    def get_all_additionals():
        additionals = AdditionalRepository.get_all()
        return {
            "success": True,
            "data": [additional.to_dict() for additional in additionals] if additionals else []
        }
    
    @staticmethod
    def update_additional(additional_id, data):
        additional = AdditionalRepository.get_by_id(additional_id)
        if not additional:
            return {
                "success": False,
                "error": "Servicio adicional no encontrado."
            }
        
        if 'price' in data and data['price'] is not None:
            additional.price = float(data['price'])
        
        if 'appointment_id' in data and data['appointment_id']:
            additional.appointment_id = int(data['appointment_id'])
        
        additional.concept = data.get('concept', additional.concept)

        updated = AdditionalRepository.update(additional)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_additional(additional_id):
        additional = AdditionalRepository.get_by_id(additional_id)
        if not additional:
            return {
                "success": False,
                "error": "Servicio adicional no encontrado."
            }
        AdditionalRepository.delete(additional)
        return {
            "success": True,
            "message": "Servicio adicional eliminado correctamente."
        }