from flask import Blueprint, jsonify

from app.core.blueprints import API_BLUEPRINTS

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/status', methods=['GET'])
def status():
    return jsonify(status='ok',message="API is running"), 200

def register_routes(app):
    app.register_blueprint(api)

    for blueprint in API_BLUEPRINTS:
        app.register_blueprint(blueprint)
    