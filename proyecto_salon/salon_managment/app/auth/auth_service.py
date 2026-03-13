from app import bcrypt
from flask_jwt_extended import create_access_token
from app.repositories.member_repository import MemberRepository

class AuthService:

    @staticmethod
    def login(data):
        member = MemberRepository.get_by_email(data.get('email'))
        
        if not member:
            return {
                "success": False,
                "error": "Miembro no encontrado."
            }
        
        if not bcrypt.check_password_hash(member.password, data.get('password')):
            return {
                "success": False,
                "error": "Contraseña incorrecta."
            }
        
        access_token = create_access_token(
            identity=member.id,
            additional_claims={
                "role": member.rol.name,
                "email": member.email
                
            }
        )
        return {
            "success": True,
            "data": member.to_dict(exclude_password=True),
            "access_token": access_token
        }