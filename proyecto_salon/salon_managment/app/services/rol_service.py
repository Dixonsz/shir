from app.repositories.rol_repository import RolRepository
from app.models.rol import Rol

class RolService:

    @staticmethod
    def create_rol(data):
        if RolRepository.get_by_name(data.get('name')):
            return {
                "success": False,
                "error": "Ya existe un rol con este nombre."
            }
        rol = Rol(
            name=data['name'],
            description=data.get('description')
        )
        created = RolRepository.create(rol)
        return {
            "success": True,
            "data": created.to_dict()
        }
    
    @staticmethod
    def get_rol_by_id(rol_id):
        rol = RolRepository.get_by_id(rol_id)
        if not rol:
            return {
                "success": False,
                "error": "Rol no encontrado."
            }
        return {
            "success": True,
            "data": rol.to_dict()
        }
    
    @staticmethod
    def get_all_roles():
        roles = RolRepository.get_all()
        return {
            "success": True,
            "data": [role.to_dict() for role in roles] if roles else []
        }
    
    @staticmethod
    def update_rol(rol_id, data):
        rol = RolRepository.get_by_id(rol_id)
        if not rol:
            return {
                "success": False,
                "error": "Rol no encontrado."
            }
        rol.name = data.get('name', rol.name)
        rol.description = data.get('description', rol.description)
        updated = RolRepository.update(rol)
        return {
            "success": True,
            "data": updated.to_dict()
        }
    
    @staticmethod
    def delete_rol(rol_id):
        rol = RolRepository.get_by_id(rol_id)
        if not rol:
            return {
                "success": False,
                "error": "Rol no encontrado."
            }
        RolRepository.delete(rol)
        return {
            "success": True,
            "message": "Rol eliminado correctamente."
        }