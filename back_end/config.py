import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()


def _normalize_database_url(raw_url):
    if not raw_url:
        return ''

    parsed = urlparse(raw_url)
    if not parsed.scheme:
        return ''

    if raw_url.startswith('mysql://'):
        return raw_url.replace('mysql://', 'mysql+pymysql://', 1)

    if raw_url.startswith('mysql+mysqldb://'):
        return raw_url.replace('mysql+mysqldb://', 'mysql+pymysql://', 1)

    return raw_url


def _require_env(name):
    value = os.getenv(name, '').strip()
    if not value:
        raise RuntimeError(f'La variable de entorno {name} es obligatoria en produccion.')
    return value


def _require_any_env(*names):
    for name in names:
        value = os.getenv(name, '').strip()
        if value:
            return value

    joined_names = ' o '.join(names)
    raise RuntimeError(f'Debes configurar {joined_names} en produccion.')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '')

    RECAPTCHA_ENABLED = os.getenv('RECAPTCHA_ENABLED', 'false').lower() == 'true'
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '')
    RECAPTCHA_VERIFY_URL = os.getenv('RECAPTCHA_VERIFY_URL', 'https://www.google.com/recaptcha/api/siteverify')
    RECAPTCHA_MIN_SCORE = float(os.getenv('RECAPTCHA_MIN_SCORE', 0.5))
    RECAPTCHA_EXPECTED_ACTION = os.getenv('RECAPTCHA_EXPECTED_ACTION', 'login')
    RECAPTCHA_VALIDATE_ACTION = os.getenv('RECAPTCHA_VALIDATE_ACTION', 'false').lower() == 'true'

    SMS_ENABLED = os.getenv('SMS_ENABLED', 'false').lower() == 'true'
    SMS_PROVIDER = os.getenv('SMS_PROVIDER', 'twilio').strip().lower()
    SMS_TWILIO_ACCOUNT_SID = os.getenv('SMS_TWILIO_ACCOUNT_SID', '').strip()
    SMS_TWILIO_AUTH_TOKEN = os.getenv('SMS_TWILIO_AUTH_TOKEN', '').strip()
    SMS_TWILIO_FROM = os.getenv('SMS_TWILIO_FROM', '').strip()
    SMS_ADMIN_PHONE = os.getenv('SMS_ADMIN_PHONE', '').strip()
    SMS_NOTIFY_CLIENT = os.getenv('SMS_NOTIFY_CLIENT', 'true').strip().lower() == 'true'
    SMS_NOTIFY_ADMIN = os.getenv('SMS_NOTIFY_ADMIN', 'true').strip().lower() == 'true'
    SMS_DEFAULT_COUNTRY_CODE = os.getenv('SMS_DEFAULT_COUNTRY_CODE', '+57').strip()
    SMS_REQUEST_TIMEOUT = int(os.getenv('SMS_REQUEST_TIMEOUT', 6))

    EMAIL_ENABLED = os.getenv('EMAIL_ENABLED', 'false').lower() == 'true'
    EMAIL_SMTP_HOST = os.getenv('EMAIL_SMTP_HOST', '').strip()
    EMAIL_SMTP_PORT = int(os.getenv('EMAIL_SMTP_PORT', 587))
    EMAIL_SMTP_USERNAME = os.getenv('EMAIL_SMTP_USERNAME', '').strip()
    EMAIL_SMTP_PASSWORD = os.getenv('EMAIL_SMTP_PASSWORD', '').strip()
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'true').strip().lower() == 'true'
    EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'false').strip().lower() == 'true'
    EMAIL_FROM = os.getenv('EMAIL_FROM', '').strip()
    EMAIL_ADMIN_TO = os.getenv('EMAIL_ADMIN_TO', '').strip()
    EMAIL_NOTIFY_CLIENT = os.getenv('EMAIL_NOTIFY_CLIENT', 'true').strip().lower() == 'true'
    EMAIL_NOTIFY_ADMIN = os.getenv('EMAIL_NOTIFY_ADMIN', 'true').strip().lower() == 'true'
    EMAIL_SUBJECT_PREFIX = os.getenv('EMAIL_SUBJECT_PREFIX', '[Salon]').strip()
    EMAIL_ADMIN_CALENDAR_LINK_ENABLED = os.getenv('EMAIL_ADMIN_CALENDAR_LINK_ENABLED', 'true').strip().lower() == 'true'
    EMAIL_ADMIN_ICS_DURATION_MINUTES = int(os.getenv('EMAIL_ADMIN_ICS_DURATION_MINUTES', 60))
    EMAIL_ADMIN_ICS_LOCATION = os.getenv('EMAIL_ADMIN_ICS_LOCATION', 'Salon').strip()
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '') or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  
    
    DATABASE_URL = _normalize_database_url(os.getenv('DATABASE_URL') or os.getenv('MYSQL_URL'))

    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'salon_managment')

    SQLALCHEMY_DATABASE_URI = DATABASE_URL or (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

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
    DEFAULT_ROLE_NAME = os.getenv('DEFAULT_ROLE_NAME', '').strip()
    DEFAULT_ROLE_DESCRIPTION = os.getenv('DEFAULT_ROLE_DESCRIPTION', '').strip()
    DEFAULT_MEMBER_FIRST_NAME = os.getenv('DEFAULT_MEMBER_FIRST_NAME', '').strip()
    DEFAULT_MEMBER_LAST_NAME = os.getenv('DEFAULT_MEMBER_LAST_NAME', '').strip()
    DEFAULT_MEMBER_EMAIL = os.getenv('DEFAULT_MEMBER_EMAIL', '').strip()
    DEFAULT_MEMBER_PASSWORD = os.getenv('DEFAULT_MEMBER_PASSWORD', '')
    DEFAULT_MEMBER_PHONE = os.getenv('DEFAULT_MEMBER_PHONE', '').strip()
    DEFAULT_MEMBER_SPECIALTY = os.getenv('DEFAULT_MEMBER_SPECIALTY', '').strip()

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    SECRET_KEY = _require_env('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '').strip() or SECRET_KEY
    DATABASE_URL = _normalize_database_url(_require_any_env('DATABASE_URL', 'MYSQL_URL'))
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    DEFAULT_MEMBER_EMAIL = _require_env('DEFAULT_MEMBER_EMAIL')
    DEFAULT_MEMBER_PASSWORD = _require_env('DEFAULT_MEMBER_PASSWORD')

    DEBUG = False
    SQLALCHEMY_ECHO = False



config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
