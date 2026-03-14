from app.models.member import Member
from app import bcrypt
from app.repositories.member_repository import MemberRepository

from app.utils.cloudinary_service import delete_image, upload_image

class MemberService:

    @staticmethod
    def create_member(data):
        try:
            if MemberRepository.get_by_email(data.get('email')):
                return {
                    "success": False,
                    "error": "Correo electrónico ya registrado."
                }
            
            password = data.get('password', 'Temporal123')
            hashed_password = bcrypt.generate_password_hash(
                password
            ).decode('utf-8')

            membership_end_date = data.get('membership_end_date')
            if membership_end_date == '' or membership_end_date is None:
                membership_end_date = None
            
            membership_start_date = data.get('membership_start_date')
            if membership_start_date == '' or membership_start_date is None:
                from datetime import date
                membership_start_date = date.today()
            
            phone_number = data.get('phone_number')
            if phone_number == '':
                phone_number = None
                
            specialty = data.get('specialty')
            if specialty == '':
                specialty = None
            
            rol_id = int(data['rol_id']) if data.get('rol_id') else None
            
            member = Member(
                first_name=data['first_name'], 
                last_name=data['last_name'],
                password=hashed_password,
                email=data['email'],
                phone_number=phone_number,
                membership_start_date=membership_start_date,
                membership_end_date=membership_end_date,
                specialty=specialty,
                rol_id=rol_id
            )
            
            created = MemberRepository.create(member)
            
            
            return {
                "success": True,
                "data": created.to_dict(exclude_password=True)
            }
        except Exception as e:
            print(f"Error al crear miembro: {str(e)}")
            return {
                "success": False,
                "error": f"Error al crear miembro: {str(e)}"
            }
    
    @staticmethod
    def get_member_by_id(member_id):
        if not MemberRepository.get_by_id(member_id):
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        member = MemberRepository.get_by_id(member_id)
        return {
            "success": True,
            "data": member.to_dict(exclude_password=True)
        }
    
    @staticmethod
    def get_all_members():
        members = MemberRepository.get_all()
        return {
            "success": True,
            "data": [member.to_dict(exclude_password=True) for member in members] if members else []
        }
    
    @staticmethod
    def update_member(member_id, data):
        member = MemberRepository.get_by_id(member_id)
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        
        if 'password' in data and data['password']:
            hashed_password = bcrypt.generate_password_hash(
                data['password']
            ).decode('utf-8')
            member.password = hashed_password
        
        member.first_name = data.get('first_name', member.first_name)
        member.last_name = data.get('last_name', member.last_name)
        member.email = data.get('email', member.email)
        
        phone_number = data.get('phone_number', member.phone_number)
        member.phone_number = None if phone_number == '' else phone_number
        
        membership_end_date = data.get('membership_end_date', member.membership_end_date)
        member.membership_end_date = None if membership_end_date == '' else membership_end_date
        
        specialty = data.get('specialty', member.specialty)
        member.specialty = None if specialty == '' else specialty
        
        member.membership_start_date = data.get('membership_start_date', member.membership_start_date)
        
        if 'rol_id' in data and data['rol_id']:
            member.rol_id = int(data['rol_id'])
        
        member.is_active = data.get('is_active', member.is_active)

        updated = MemberRepository.update(member)
        return {
            "success": True,
            "data": updated.to_dict(exclude_password=True)
        }
    
    @staticmethod
    def delete_member(member_id):
        member = MemberRepository.get_by_id(member_id)
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        
        if member.photo_public_id:
            try:
                print(f"Eliminando foto de Cloudinary: {member.photo_public_id}")
                delete_image(member.photo_public_id)
                print(f"Foto eliminada: {member.photo_public_id}")
            except Exception as e:
                print(f"Error al eliminar imagen de Cloudinary: {str(e)}")
        
        try:
            MemberRepository.hard_delete(member)
            return {
                "success": True,
                "message": "Miembro eliminado permanentemente."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al eliminar miembro: {str(e)}"
            }
    
    @staticmethod
    def upload_photo(member_id, file):
        member = MemberRepository.get_by_id(member_id)
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        
        try:
            if member.photo_public_id:
                try:
                    delete_image(member.photo_public_id)
                except Exception as e:
                    print(f"Error al eliminar imagen anterior: {str(e)}")

            result = upload_image(
                file,
                folder='salon/members',
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
            
            member.photo_url = result['url']
            member.photo_public_id = result['public_id']
            
            updated = MemberRepository.update(member)
            
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
    def delete_photo(member_id):
        member = MemberRepository.get_by_id(member_id)
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        
        if not member.photo_public_id:
            return {
                "success": False,
                "error": "El miembro no tiene foto."
            }
        
        try:
            delete_image(member.photo_public_id)
            
            member.photo_url = None
            member.photo_public_id = None
            
            MemberRepository.update(member)
            
            return {
                "success": True,
                "message": "Foto eliminada correctamente."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al eliminar imagen: {str(e)}"
            }