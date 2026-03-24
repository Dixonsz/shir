import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    RECAPTCHA_ENABLED = os.getenv('RECAPTCHA_ENABLED', 'false').lower() == 'true'
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '')
    RECAPTCHA_VERIFY_URL = os.getenv('RECAPTCHA_VERIFY_URL', 'https://www.google.com/recaptcha/api/siteverify')
    RECAPTCHA_MIN_SCORE = float(os.getenv('RECAPTCHA_MIN_SCORE', 0.5))
    RECAPTCHA_EXPECTED_ACTION = os.getenv('RECAPTCHA_EXPECTED_ACTION', 'login')
    RECAPTCHA_VALIDATE_ACTION = os.getenv('RECAPTCHA_VALIDATE_ACTION', 'false').lower() == 'true'

    # Configuracion de notificaciones WhatsApp (Meta Cloud API / Twilio)
    WHATSAPP_ENABLED = os.getenv('WHATSAPP_ENABLED', 'false').lower() == 'true'
    WHATSAPP_PROVIDER = os.getenv('WHATSAPP_PROVIDER', 'meta').strip().lower()

    # Meta WhatsApp Business Platform (Cloud API)
    WHATSAPP_META_API_VERSION = os.getenv('WHATSAPP_META_API_VERSION', 'v21.0').strip()
    WHATSAPP_META_PHONE_NUMBER_ID = os.getenv('WHATSAPP_META_PHONE_NUMBER_ID', '').strip()
    WHATSAPP_META_ACCESS_TOKEN = os.getenv('WHATSAPP_META_ACCESS_TOKEN', '').strip()
    WHATSAPP_META_USE_TEMPLATES = os.getenv('WHATSAPP_META_USE_TEMPLATES', 'true').strip().lower()
    WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION = os.getenv('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION', '').strip()
    WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_LANG = os.getenv('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_LANG', 'en_US').strip()
    WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_PARAMS = os.getenv('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_PARAMS', '').strip()
    WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT = os.getenv('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT', '').strip()
    WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_LANG = os.getenv('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_LANG', 'en_US').strip()
    WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_PARAMS = os.getenv('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_PARAMS', '').strip()
    WHATSAPP_META_SEND_DATA_TEXT_AFTER_TEMPLATE = os.getenv('WHATSAPP_META_SEND_DATA_TEXT_AFTER_TEMPLATE', 'true').strip().lower() == 'true'

    # Twilio WhatsApp (opcional como fallback/proveedor alterno)
    WHATSAPP_TWILIO_ACCOUNT_SID = os.getenv('WHATSAPP_TWILIO_ACCOUNT_SID', '')
    WHATSAPP_TWILIO_AUTH_TOKEN = os.getenv('WHATSAPP_TWILIO_AUTH_TOKEN', '')
    WHATSAPP_TWILIO_FROM = os.getenv('WHATSAPP_TWILIO_FROM', 'whatsapp:+14155238886')
    WHATSAPP_ADMIN_PHONE = os.getenv('WHATSAPP_ADMIN_PHONE', '')
    WHATSAPP_NOTIFY_CLIENT = os.getenv('WHATSAPP_NOTIFY_CLIENT', 'true').strip().lower() == 'true'
    WHATSAPP_NOTIFY_ADMIN = os.getenv('WHATSAPP_NOTIFY_ADMIN', 'true').strip().lower() == 'true'
    WHATSAPP_DEFAULT_COUNTRY_CODE = os.getenv('WHATSAPP_DEFAULT_COUNTRY_CODE', '+57')
    WHATSAPP_REQUEST_TIMEOUT = int(os.getenv('WHATSAPP_REQUEST_TIMEOUT', 6))
    WHATSAPP_WEBHOOK_VERIFY_TOKEN = os.getenv('WHATSAPP_WEBHOOK_VERIFY_TOKEN', '').strip()
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  
    
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '1234')
    DB_NAME = os.getenv('DB_NAME', 'salon_managment')
    
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    # Seed para miembro por defecto al iniciar la app
    ENABLE_DEFAULT_MEMBER_SEED = os.getenv('ENABLE_DEFAULT_MEMBER_SEED', 'true').lower() == 'true'
    DEFAULT_SYSTEM_ROLES = [
        {
            'name': 'Administrador',
            'description': 'Acceso total al sistema y administracion de usuarios y roles',
        },
        {
            'name': 'Gerente',
            'description': 'Gestion operativa del salon con permisos administrativos limitados',
        },
        {
            'name': 'Recepcionista',
            'description': 'Gestion de clientes y citas en mostrador',
        },
        {
            'name': 'Estilista',
            'description': 'Consulta de agenda y gestion de servicios en atencion',
        },
        {
            'name': 'Marketing',
            'description': 'Gestion de promociones, campanas y galeria',
        },
    ]
    DEFAULT_ROLE_NAME = os.getenv('DEFAULT_ROLE_NAME', 'Administrador')
    DEFAULT_ROLE_DESCRIPTION = os.getenv('DEFAULT_ROLE_DESCRIPTION', 'Rol creado automaticamente para el seed inicial')
    DEFAULT_MEMBER_FIRST_NAME = os.getenv('DEFAULT_MEMBER_FIRST_NAME', 'Admin')
    DEFAULT_MEMBER_LAST_NAME = os.getenv('DEFAULT_MEMBER_LAST_NAME', 'Salon')
    DEFAULT_MEMBER_EMAIL = os.getenv('DEFAULT_MEMBER_EMAIL', 'admin@salon.local')
    DEFAULT_MEMBER_PASSWORD = os.getenv('DEFAULT_MEMBER_PASSWORD', 'Admin123*')
    DEFAULT_MEMBER_PHONE = os.getenv('DEFAULT_MEMBER_PHONE', '8888-8888')
    DEFAULT_MEMBER_SPECIALTY = os.getenv('DEFAULT_MEMBER_SPECIALTY', 'Administracion')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False



config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
