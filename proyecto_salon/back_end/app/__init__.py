import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.auth.access_control import register_access_control
from app.core.cloudinary import configure_cloudinary
from app.core.extensions import bcrypt, db, jwt, migrate
from config import config

load_dotenv()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    configure_cloudinary()

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
    register_access_control(app)

    with app.app_context():
        # Import package so SQLAlchemy registers models metadata.
        from app import models  # noqa: F401
        from app.core.seeding import seed_default_member

        from app.routes import register_routes
        register_routes(app)

        # Seed inicial idempotente para rol y miembro por defecto.
        seed_default_member()
  
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
