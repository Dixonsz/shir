from app.services.marketing_service import MarketingService
from flask import Blueprint, request, jsonify
import cloudinary.uploader

marketing_bp = Blueprint('marketing_bp', __name__, url_prefix='/api')

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
        promotion_id = request.form.get('promotion_id')
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        
        data = {
            'name': request.form.get('name'),
            'description': request.form.get('description'),
            'promotion_id': int(promotion_id) if promotion_id and promotion_id != '' else None,
            'start_date': start_date if start_date and start_date != '' else None,
            'end_date': end_date if end_date and end_date != '' else None
        }
        
        if 'image' in request.files:
            file = request.files['image']
            file.seek(0) 
            
            if file and file.filename != '':
                try:
                    import os
                    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
                    if not cloud_name or cloud_name == 'root':
                        data['media_url'] = None
                    else:
                        upload_result = cloudinary.uploader.upload(
                            file,
                            folder='salon_marketing',
                            allowed_formats=['jpg', 'jpeg', 'png', 'gif', 'webp'],
                            transformation=[
                                {'width': 1200, 'height': 1200, 'crop': 'limit'},
                                {'quality': 'auto'}
                            ]
                        )
                        data['media_url'] = upload_result['secure_url']
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    data['media_url'] = None
        
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
        promotion_id = request.form.get('promotion_id')
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        
        data = {
            'name': request.form.get('name'),
            'description': request.form.get('description'),
            'promotion_id': int(promotion_id) if promotion_id and promotion_id != '' and promotion_id != 'null' else None,
            'start_date': start_date if start_date and start_date != '' and start_date != 'null' else None,
            'end_date': end_date if end_date and end_date != '' and end_date != 'null' else None
        }
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                try:
                    import os
                    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
                    if not cloud_name or cloud_name == 'root':
                        pass
                    else:
                        upload_result = cloudinary.uploader.upload(
                            file,
                            folder='salon_marketing',
                            allowed_formats=['jpg', 'jpeg', 'png', 'gif', 'webp'],
                            transformation=[
                                {'width': 1200, 'height': 1200, 'crop': 'limit'},
                                {'quality': 'auto'}
                            ]
                        )
                        data['media_url'] = upload_result['secure_url']
                except Exception as e:
                    import traceback
                    traceback.print_exc()
        
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
