from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import config
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import cloudinary

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
load_dotenv()

# Configurar Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
   

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    bcrypt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configuración de CORS - Permitir todos los orígenes en desarrollo
    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         expose_headers=["Content-Type", "Authorization"]
    )
    
    jwt.init_app(app)

    with app.app_context():
        from app.models import (
            Client, Member, Rol, CategoryService, CategoryProduct,
            Service, Product, Appointment, AppointmentService,
            ServiceProduct, Promotion, ServicePromotion, Marketing,
            MarketingItem, Additional
        )
        
        from app.routes import register_routes
        register_routes(app)
  
    @app.route('/health')
    def health():
        return {'status': 'ok', 'message': 'API está funcionando'}, 200
    
    # Manejador de errores global
    @app.errorhandler(500)
    def handle_500(error):
        from flask import jsonify
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor',
            'details': str(error)
        }), 500
    
    @app.errorhandler(404)
    def handle_404(error):
        from flask import jsonify
        return jsonify({
            'success': False,
            'error': 'Recurso no encontrado'
        }), 404
    
    return app
