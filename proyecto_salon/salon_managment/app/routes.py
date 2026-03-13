from flask import blueprints,jsonify

api = blueprints.Blueprint('api', __name__, url_prefix='/api')

@api.route('/status', methods=['GET'])
def status():
    return jsonify(status='ok',message="API is running"), 200

def register_routes(app):
    app.register_blueprint(api)

    from app.auth.cloudinary_config import cloudinary_bp
    app.register_blueprint(cloudinary_bp)

    from app.controllers.member_controller import member_bp
    app.register_blueprint(member_bp)
    
    from app.controllers.client_controller import client_bp
    app.register_blueprint(client_bp)
    
    from app.controllers.rol_controller import rol_bp
    app.register_blueprint(rol_bp)
    
    from app.controllers.product_controller import product_bp
    app.register_blueprint(product_bp)
    
    from app.controllers.additional_controller import additional_bp
    app.register_blueprint(additional_bp)
    
    from app.controllers.appointment_controller import appointment_bp
    app.register_blueprint(appointment_bp)
    
    from app.controllers.service_controller import service_bp
    app.register_blueprint(service_bp)
    
    from app.controllers.promotion_controller import promotion_bp
    app.register_blueprint(promotion_bp)
    
    from app.controllers.category_service_controller import category_service_bp
    app.register_blueprint(category_service_bp)
    
    from app.controllers.category_product_controller import category_product_bp
    app.register_blueprint(category_product_bp)
    
    from app.controllers.marketing_controller import marketing_bp
    app.register_blueprint(marketing_bp)
    
    from app.controllers.gallery_controller import gallery_bp
    app.register_blueprint(gallery_bp)
    