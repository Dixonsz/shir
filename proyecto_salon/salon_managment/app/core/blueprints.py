from app.auth.auth_controller import auth_bp
from app.auth.cloudinary_config import cloudinary_bp
from app.controllers.additional_controller import additional_bp
from app.controllers.appointment_controller import appointment_bp
from app.controllers.category_product_controller import category_product_bp
from app.controllers.category_service_controller import category_service_bp
from app.controllers.client_controller import client_bp
from app.controllers.gallery_controller import gallery_bp
from app.controllers.marketing_controller import marketing_bp
from app.controllers.member_controller import member_bp
from app.controllers.product_controller import product_bp
from app.controllers.promotion_controller import promotion_bp
from app.controllers.rol_controller import rol_bp
from app.controllers.service_controller import service_bp

API_BLUEPRINTS = (
    auth_bp,
    cloudinary_bp,
    member_bp,
    client_bp,
    rol_bp,
    product_bp,
    additional_bp,
    appointment_bp,
    service_bp,
    promotion_bp,
    category_service_bp,
    category_product_bp,
    marketing_bp,
    gallery_bp,
)
