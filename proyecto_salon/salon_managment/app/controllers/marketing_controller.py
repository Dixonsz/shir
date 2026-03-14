from app.services.marketing_service import MarketingService
from flask import Blueprint, request, jsonify

from app.utils.cloudinary_service import upload_image

marketing_bp = Blueprint('marketing_bp', __name__, url_prefix='/api')


def _build_marketing_form_data(form_data):
    promotion_id = form_data.get('promotion_id')
    start_date = form_data.get('start_date')
    end_date = form_data.get('end_date')

    return {
        'name': form_data.get('name'),
        'description': form_data.get('description'),
        'promotion_id': int(promotion_id) if promotion_id and promotion_id not in ('', 'null') else None,
        'start_date': start_date if start_date and start_date not in ('', 'null') else None,
        'end_date': end_date if end_date and end_date not in ('', 'null') else None,
    }


def _attach_uploaded_media(data):
    file = request.files.get('image')
    if not file or file.filename == '':
        return

    file.seek(0)
    result = upload_image(file, folder='salon_marketing')
    if result.get('success'):
        data['media_url'] = result['url']

@marketing_bp.route('/marketing', methods=['POST'])
def create_marketing():
    result = MarketingService.create_marketing(request.json)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@marketing_bp.route('/marketing/with-image', methods=['POST'])
def create_marketing_with_image():
    try:
        data = _build_marketing_form_data(request.form)
        _attach_uploaded_media(data)
        
        result = MarketingService.create_marketing(data)
        
        if not result["success"]:
            return jsonify(
                success=False,
                message=result["error"]
            ), 400
        
        return jsonify(
            success=True,
            data=result["data"]
        ), 201
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify(
            success=False,
            message=f"Error al crear campaña: {str(e)}"
        ), 500

@marketing_bp.route('/marketing/<int:marketing_id>', methods=['GET'])
def get_marketing(marketing_id):
    result = MarketingService.get_marketing_by_id(marketing_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@marketing_bp.route('/marketing', methods=['GET'])
def get_all_marketing():
    result = MarketingService.get_all_marketing()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@marketing_bp.route('/marketing/<int:marketing_id>', methods=['PUT'])
def update_marketing(marketing_id):
    result = MarketingService.update_marketing(marketing_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@marketing_bp.route('/marketing/<int:marketing_id>/with-image', methods=['PUT'])
def update_marketing_with_image(marketing_id):
    try:
        data = _build_marketing_form_data(request.form)
        _attach_uploaded_media(data)
        
        result = MarketingService.update_marketing(marketing_id, data)
        
        if not result["success"]:
            return jsonify(
                success=False,
                message=result["error"]
            ), 400
        
        return jsonify(
            success=True,
            data=result["data"]
        ), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify(
            success=False,
            message=f"Error al actualizar campaña: {str(e)}"
        ), 500

@marketing_bp.route('/marketing/<int:marketing_id>', methods=['DELETE'])
def delete_marketing(marketing_id):
    result = MarketingService.delete_marketing(marketing_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@marketing_bp.route('/marketing/active', methods=['GET'])
def get_active_campaigns():
    result = MarketingService.get_active_campaigns()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@marketing_bp.route('/marketing/promotion/<int:promotion_id>', methods=['GET'])
def get_marketing_by_promotion(promotion_id):
    result = MarketingService.get_marketing_by_promotion(promotion_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200
