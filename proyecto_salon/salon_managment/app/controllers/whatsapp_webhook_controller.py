from flask import Blueprint, current_app, jsonify, request


whatsapp_webhook_bp = Blueprint('whatsapp_webhook_bp', __name__, url_prefix='/api/whatsapp')


@whatsapp_webhook_bp.route('/webhook', methods=['GET'])
def verify_webhook():
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    expected_token = current_app.config.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN', '')

    if mode == 'subscribe' and expected_token and token == expected_token:
        current_app.logger.info('WhatsApp webhook verificado correctamente.')
        return challenge or '', 200

    current_app.logger.warning(
        'WhatsApp webhook verificacion fallida. mode=%s token_present=%s expected_configured=%s',
        mode,
        bool(token),
        bool(expected_token),
    )
    return jsonify(success=False, message='Webhook verification failed'), 403


@whatsapp_webhook_bp.route('/webhook', methods=['POST'])
def receive_webhook():
    payload = request.get_json(silent=True) or {}

    entries = payload.get('entry') or []
    status_events = 0
    message_events = 0

    for entry in entries:
        changes = entry.get('changes') or []
        for change in changes:
            value = change.get('value') or {}

            statuses = value.get('statuses') or []
            for status_item in statuses:
                status_events += 1
                current_app.logger.info(
                    (
                        'WhatsApp webhook status. message_id=%s status=%s recipient_id=%s '
                        'conversation_id=%s pricing_category=%s timestamp=%s errors=%s'
                    ),
                    status_item.get('id'),
                    status_item.get('status'),
                    status_item.get('recipient_id'),
                    (status_item.get('conversation') or {}).get('id'),
                    ((status_item.get('pricing') or {}).get('category')),
                    status_item.get('timestamp'),
                    status_item.get('errors'),
                )

            messages = value.get('messages') or []
            for message_item in messages:
                message_events += 1
                current_app.logger.info(
                    'WhatsApp webhook inbound. from=%s message_id=%s type=%s timestamp=%s',
                    message_item.get('from'),
                    message_item.get('id'),
                    message_item.get('type'),
                    message_item.get('timestamp'),
                )

    if status_events == 0 and message_events == 0:
        current_app.logger.info('WhatsApp webhook recibido sin eventos de mensajes/estatus.')

    return jsonify(success=True), 200
