import datetime
from app import db
# Miembros del sistema.
# Cada miembro tiene información personal y detalles de cada empleado.
# Esta información es crucial para gestionar las citas y servicios que ofrecen los miembros.

class Member(db.Model):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=True)
    membership_start_date = db.Column(db.Date, nullable=False)
    membership_end_date = db.Column(db.Date, nullable=True)
    specialty = db.Column(db.String(255), nullable=True)
    photo_url = db.Column(db.String(500), nullable=True)
    photo_public_id = db.Column(db.String(255), nullable=True)
    rol_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    rol = db.relationship('Rol', backref=db.backref('members', lazy=True))
    secondary_roles = db.relationship(
        'Rol',
        secondary='member_roles',
        lazy='joined',
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def roles(self):
        unique = {}
        if self.rol is not None:
            unique[self.rol.id] = self.rol

        for role in self.secondary_roles or []:
            unique[role.id] = role

        return list(unique.values())

    @property
    def role_names(self):
        return [role.name for role in self.roles]
    
    @property
    def is_membership_active(self):
        from datetime import datetime
        now = datetime.now().date()
        
        if not self.membership_start_date:
            return False
        
        if not self.membership_end_date:
            return now >= self.membership_start_date
        
        return self.membership_start_date <= now <= self.membership_end_date

    def to_dict(self, exclude_password=False):
        data = {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "membership_start_date": self.membership_start_date.isoformat() if self.membership_start_date else None,
            "membership_end_date": self.membership_end_date.isoformat() if self.membership_end_date else None,
            "is_membership_active": self.is_membership_active,
            "specialty": self.specialty,
            "photo_url": self.photo_url,
            "photo_public_id": self.photo_public_id,
            "rol_id": self.rol_id,
            "rol_name": self.rol.name if self.rol else None,
            "role_ids": [role.id for role in self.roles],
            "role_names": self.role_names,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        if not exclude_password:
            data["password"] = self.password
        return data