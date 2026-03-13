from flask import Blueprint,request,jsonify
from app.auth.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    result = AuthService.login(data)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 401
    return jsonify(
        success=True,
        data=result["data"],
        token=result["access_token"]
    ), 200