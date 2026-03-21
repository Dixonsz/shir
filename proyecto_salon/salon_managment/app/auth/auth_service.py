from app import bcrypt
from flask_jwt_extended import create_access_token
from app.repositories.member_repository import MemberRepository
from app.auth.recaptcha_service import verify_recaptcha

class AuthService:

    @staticmethod
    def login(data):
        data = data or {}

        captcha_token = data.get('captchaToken')
        remote_ip = data.get('remoteIp')
        captcha_valid, captcha_error = verify_recaptcha(captcha_token, remote_ip=remote_ip)
        if not captcha_valid:
            return {
                "success": False,
                "error": captcha_error
            }

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
        
        role_names = member.role_names if hasattr(member, 'role_names') else [member.rol.name]
        primary_role = role_names[0] if role_names else (member.rol.name if member.rol else None)

        access_token = create_access_token(
            # Flask-JWT-Extended/PyJWT validan 'sub' como string en verificacion.
            identity=str(member.id),
            additional_claims={
                "role": primary_role,
                "roles": role_names,
                "email": member.email
                
            }
        )
        return {
            "success": True,
            "data": member.to_dict(exclude_password=True),
            "access_token": access_token
        }