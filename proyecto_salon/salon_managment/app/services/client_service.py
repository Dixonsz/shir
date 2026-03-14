from app.models.client import Client
from app.repositories.client_repository import ClientRepository

from app.utils.cloudinary_service import delete_image, upload_image

class ClientService:

    @staticmethod
    def create_client(data):
        if ClientRepository.get_by_number_id(data.get('number_id')):
            return {
                "success": False,
                "error": "Número de identificación ya registrado."
            }

        client = Client(
            number_id=data['number_id'],
            name=data['name'],
            email=data['email'],
            phone_number=data.get('phone_number') if data.get('phone_number') else None,
            is_active=data.get('is_active', True)
        )

        created = ClientRepository.create(client)

        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_client_by_id(client_id):
        client = ClientRepository.get_by_id(client_id)
        if not client:
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        return {
            "success": True,
            "data": client.to_dict()
        }
    
    @staticmethod
    def get_all_clients():
        clients = ClientRepository.get_all()
        return {
            "success": True,
            "data": [client.to_dict() for client in clients] if clients else []
        }
    
    @staticmethod
    def update_client(client_id, data):
        client = ClientRepository.get_by_id(client_id)
        if not client:
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        
        client.number_id = data.get('number_id', client.number_id)
        client.name = data.get('name', client.name)
        client.email = data.get('email', client.email)
        client.phone_number = data.get('phone_number') if data.get('phone_number') else client.phone_number
        client.is_active = data.get('is_active', client.is_active)

        updated = ClientRepository.update(client)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_client(client_id):
        client = ClientRepository.get_by_id(client_id)
        if not client:
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        
        if client.appointments and len(client.appointments) > 0:
            print(f"Cliente {client_id} tiene citas asociadas. Usando soft delete.")
            ClientRepository.delete(client)
            return {
                "success": True,
                "message": "Cliente desactivado (tiene citas asociadas)."
            }
        
        if client.photo_public_id:
            try:
                print(f"Eliminando foto de Cloudinary: {client.photo_public_id}")
                delete_image(client.photo_public_id)
                print(f"Foto eliminada: {client.photo_public_id}")
            except Exception as e:
                print(f"Error al eliminar imagen de Cloudinary: {str(e)}")
        
        try:
            ClientRepository.hard_delete(client)
            return {
                "success": True,
                "message": "Cliente eliminado permanentemente."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al eliminar cliente: {str(e)}"
            }

    @staticmethod
    def get_client_by_number_id(number_id):
        client = ClientRepository.get_by_number_id(number_id)
        if not client:
            return {
                "success": False,
                "error": f"Cliente con número de identificación {number_id} no encontrado."
            }
        return {
            "success": True,
            "data": client.to_dict()
        }
    
    @staticmethod
    def upload_photo(client_id, file):
        """Subir foto de perfil de cliente"""
        client = ClientRepository.get_by_id(client_id)
        if not client:
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        
        try:
            if client.photo_public_id:
                try:
                    delete_image(client.photo_public_id)
                except Exception as e:
                    print(f"Error al eliminar imagen anterior: {str(e)}")

            result = upload_image(
                file,
                folder='salon/clients',
                transformation=[
                    {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'}
                ]
            )

            if not result.get('success'):
                return {
                    "success": False,
                    "error": result.get('error', 'Error al subir imagen')
                }
            
            client.photo_url = result['url']
            client.photo_public_id = result['public_id']
            
            updated = ClientRepository.update(client)
            
            return {
                "success": True,
                "data": {
                    "photo_url": updated.photo_url,
                    "photo_public_id": updated.photo_public_id
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al subir imagen: {str(e)}"
            }
    
    @staticmethod
    def delete_photo(client_id):
        client = ClientRepository.get_by_id(client_id)
        if not client:
            return {
                "success": False,
                "error": "Cliente no encontrado."
            }
        
        if not client.photo_public_id:
            return {
                "success": False,
                "error": "El cliente no tiene foto."
            }
        
        try:
            delete_image(client.photo_public_id)
            
            client.photo_url = None
            client.photo_public_id = None
            
            ClientRepository.update(client)
            
            return {
                "success": True,
                "message": "Foto eliminada correctamente."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al eliminar imagen: {str(e)}"
            }