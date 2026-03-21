import json
from urllib import parse, request
from urllib.error import URLError

from flask import current_app


def verify_recaptcha(captcha_token, remote_ip=None):
    """Valida el token de reCAPTCHA contra la API de Google."""
    if not current_app.config.get('RECAPTCHA_ENABLED', False):
        return True, None

    if not captcha_token:
        return False, 'Debes completar el reCAPTCHA.'

    secret_key = current_app.config.get('RECAPTCHA_SECRET_KEY')
    verify_url = current_app.config.get('RECAPTCHA_VERIFY_URL')

    if not secret_key:
        return False, 'RECAPTCHA_SECRET_KEY no esta configurada en el servidor.'

    payload = {
        'secret': secret_key,
        'response': captcha_token,
    }

    if remote_ip:
        payload['remoteip'] = remote_ip

    encoded_payload = parse.urlencode(payload).encode('utf-8')
    verify_request = request.Request(verify_url, data=encoded_payload, method='POST')

    try:
        with request.urlopen(verify_request, timeout=5) as response:
            verification_result = json.loads(response.read().decode('utf-8'))
    except (URLError, TimeoutError, json.JSONDecodeError, ValueError):
        return False, 'No se pudo validar el reCAPTCHA. Intenta nuevamente.'

    if not verification_result.get('success'):
        return False, 'La validacion de reCAPTCHA no fue exitosa.'

    min_score = current_app.config.get('RECAPTCHA_MIN_SCORE')
    score = verification_result.get('score')
    if isinstance(score, (int, float)) and score < min_score:
        return False, 'El puntaje de reCAPTCHA es demasiado bajo.'

    expected_action = current_app.config.get('RECAPTCHA_EXPECTED_ACTION')
    validate_action = current_app.config.get('RECAPTCHA_VALIDATE_ACTION', False)
    action = verification_result.get('action')

    if validate_action and expected_action and action and action != expected_action:
        return False, 'El token de reCAPTCHA no coincide con la accion esperada.'

    return True, None
