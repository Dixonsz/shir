from datetime import date

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from app.core.extensions import bcrypt, db
from app.models.member import Member
from app.models.rol import Rol


def seed_default_member():
    """Crea rol y miembro por defecto si no existen."""
    if not current_app.config.get('ENABLE_DEFAULT_MEMBER_SEED', True):
        return

    try:
        role_name = current_app.config.get('DEFAULT_ROLE_NAME', 'Administrador')
        role_description = current_app.config.get(
            'DEFAULT_ROLE_DESCRIPTION',
            'Rol creado automaticamente para el seed inicial',
        )

        role = Rol.query.filter_by(name=role_name).first()
        if role is None:
            role = Rol(
                name=role_name,
                description=role_description,
                is_active=True,
            )
            db.session.add(role)
            db.session.flush()

        member_email = current_app.config.get('DEFAULT_MEMBER_EMAIL', 'admin@salon.local')
        member = Member.query.filter_by(email=member_email).first()

        if member is None:
            raw_password = current_app.config.get('DEFAULT_MEMBER_PASSWORD', 'Admin123*')
            hashed_password = bcrypt.generate_password_hash(raw_password).decode('utf-8')

            member = Member(
                first_name=current_app.config.get('DEFAULT_MEMBER_FIRST_NAME', 'Admin'),
                last_name=current_app.config.get('DEFAULT_MEMBER_LAST_NAME', 'Salon'),
                password=hashed_password,
                email=member_email,
                phone_number=current_app.config.get('DEFAULT_MEMBER_PHONE', '8888-8888'),
                membership_start_date=date.today(),
                membership_end_date=None,
                specialty=current_app.config.get('DEFAULT_MEMBER_SPECIALTY', 'Administracion'),
                rol_id=role.id,
                is_active=True,
            )
            db.session.add(member)
            db.session.commit()
            return

        updated = False
        if member.rol_id != role.id:
            member.rol_id = role.id
            updated = True

        if not member.is_active:
            member.is_active = True
            updated = True

        if updated:
            db.session.commit()
    except SQLAlchemyError as exc:
        db.session.rollback()
        current_app.logger.warning('No se pudo ejecutar el seed de miembro por defecto: %s', exc)
