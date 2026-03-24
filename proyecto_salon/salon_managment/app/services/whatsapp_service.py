import base64
import json
import re
from urllib import parse, request
from urllib.error import HTTPError, URLError

from flask import current_app


class WhatsAppService:

    @staticmethod
    def _mask_phone(phone_value):
        if not phone_value:
            return 'N/A'

        text = str(phone_value)
        digits = re.sub(r'\D', '', text)
        if len(digits) <= 4:
            return f'***{digits}' if digits else 'N/A'

        return f'+***{digits[-4:]}'

    @staticmethod
    def _normalize_phone(phone_raw):
        if not phone_raw:
            return None

        phone_text = str(phone_raw).strip()
        if not phone_text:
            return None

        keep_plus = phone_text.startswith('+')
        digits = re.sub(r'\D', '', phone_text)
        if not digits:
            return None

        if keep_plus:
            return f'+{digits}'

        if phone_text.startswith('00'):
            return f'+{digits[2:]}' if len(digits) > 2 else None

        default_code = str(current_app.config.get('WHATSAPP_DEFAULT_COUNTRY_CODE', '+57')).strip()
        default_digits = re.sub(r'\D', '', default_code)
        if not default_digits:
            default_digits = '57'

        return f'+{default_digits}{digits}'

    @staticmethod
    def _format_datetime(value):
        if value is None:
            return 'No definida'

        try:
            return value.strftime('%d/%m/%Y %H:%M')
        except Exception:
            return str(value)

    @staticmethod
    def _build_services_text(service_names):
        if not service_names:
            return 'Sin servicios especificados'

        unique_services = []
        for name in service_names:
            service_name = str(name).strip()
            if service_name and service_name not in unique_services:
                unique_services.append(service_name)

        return ', '.join(unique_services) if unique_services else 'Sin servicios especificados'

    @staticmethod
    def _meta_template_is_enabled():
        raw_value = str(current_app.config.get('WHATSAPP_META_USE_TEMPLATES', 'true')).strip().lower()
        return raw_value in {'1', 'true', 'yes', 'y', 'on'}

    @staticmethod
    def _parse_template_param_keys(value):
        if not value:
            return []

        if isinstance(value, (list, tuple)):
            return [str(item).strip() for item in value if str(item).strip()]

        return [item.strip() for item in str(value).split(',') if item.strip()]

    @staticmethod
    def _resolve_template_params(param_keys, context):
        resolved = []
        for key in param_keys:
            template_var_name = None
            source_key = key

            if ':' in str(key):
                template_var_name, source_key = [item.strip() for item in str(key).split(':', 1)]

            param_value = context.get(source_key)
            if param_value is None:
                param_value = ''

            if template_var_name:
                resolved.append({
                    'parameter_name': template_var_name,
                    'text': str(param_value),
                })
            else:
                resolved.append(str(param_value))
        return resolved

    @staticmethod
    def _is_truthy(value, default=True):
        if value is None:
            return default
        if isinstance(value, bool):
            return value
        return str(value).strip().lower() in {'1', 'true', 'yes', 'y', 'on'}

    @staticmethod
    def _send_twilio_message(to_phone, message_body):
        account_sid = current_app.config.get('WHATSAPP_TWILIO_ACCOUNT_SID', '')
        auth_token = current_app.config.get('WHATSAPP_TWILIO_AUTH_TOKEN', '')
        from_phone = str(current_app.config.get('WHATSAPP_TWILIO_FROM', '')).strip()
        timeout = int(current_app.config.get('WHATSAPP_REQUEST_TIMEOUT', 6))

        if from_phone and not from_phone.startswith('whatsapp:'):
            from_phone = f'whatsapp:{from_phone}'

        if not account_sid or not auth_token or not from_phone:
            current_app.logger.warning(
                'WhatsApp habilitado pero faltan credenciales Twilio (SID/TOKEN/FROM).'
            )
            return {
                'success': False,
                'error': 'Credenciales incompletas de Twilio.'
            }

        url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json'
        payload = parse.urlencode({
            'From': from_phone,
            'To': f'whatsapp:{to_phone}',
            'Body': message_body,
        }).encode('utf-8')

        basic_auth = base64.b64encode(f'{account_sid}:{auth_token}'.encode('utf-8')).decode('ascii')
        headers = {
            'Authorization': f'Basic {basic_auth}',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        req = request.Request(url, data=payload, headers=headers, method='POST')

        current_app.logger.info(
            'WhatsApp Twilio envio iniciado. to=%s from=%s chars=%s timeout=%s',
            WhatsAppService._mask_phone(to_phone),
            WhatsAppService._mask_phone(from_phone),
            len(message_body or ''),
            timeout,
        )

        try:
            with request.urlopen(req, timeout=timeout) as response:
                raw = response.read().decode('utf-8')
                data = json.loads(raw) if raw else {}
                current_app.logger.info(
                    'WhatsApp Twilio envio OK. to=%s sid=%s status=%s',
                    WhatsAppService._mask_phone(to_phone),
                    data.get('sid'),
                    data.get('status'),
                )
                return {
                    'success': True,
                    'message_sid': data.get('sid')
                }
        except (URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            current_app.logger.exception(
                'WhatsApp Twilio envio ERROR. to=%s error=%s',
                WhatsAppService._mask_phone(to_phone),
                str(exc),
            )
            return {
                'success': False,
                'error': f'Error enviando WhatsApp: {str(exc)}'
            }

    @staticmethod
    def _send_meta_message(to_phone, message_body):
        api_version = current_app.config.get('WHATSAPP_META_API_VERSION', 'v21.0')
        phone_number_id = current_app.config.get('WHATSAPP_META_PHONE_NUMBER_ID', '')
        access_token = current_app.config.get('WHATSAPP_META_ACCESS_TOKEN', '')
        timeout = int(current_app.config.get('WHATSAPP_REQUEST_TIMEOUT', 6))

        if not phone_number_id or not access_token:
            current_app.logger.warning(
                'WhatsApp Meta habilitado pero faltan credenciales (PHONE_NUMBER_ID/ACCESS_TOKEN).'
            )
            return {
                'success': False,
                'error': 'Credenciales incompletas de Meta WhatsApp Business Platform.'
            }

        # Cloud API requiere numero en formato internacional sin prefijo +.
        to_digits = re.sub(r'\D', '', str(to_phone or ''))
        if not to_digits:
            return {
                'success': False,
                'error': 'Numero destino invalido para Meta WhatsApp.'
            }

        url = f'https://graph.facebook.com/{api_version}/{phone_number_id}/messages'
        payload = {
            'messaging_product': 'whatsapp',
            'to': to_digits,
            'type': 'text',
            'text': {
                'preview_url': False,
                'body': message_body,
            },
        }
        payload_bytes = json.dumps(payload).encode('utf-8')
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        req = request.Request(url, data=payload_bytes, headers=headers, method='POST')

        current_app.logger.info(
            'WhatsApp Meta envio iniciado. to=%s phone_number_id=%s chars=%s timeout=%s api_version=%s',
            WhatsAppService._mask_phone(to_digits),
            phone_number_id,
            len(message_body or ''),
            timeout,
            api_version,
        )

        try:
            with request.urlopen(req, timeout=timeout) as response:
                raw = response.read().decode('utf-8')
                data = json.loads(raw) if raw else {}
                message_id = None
                messages = data.get('messages') or []
                if messages and isinstance(messages, list):
                    message_id = messages[0].get('id')
                current_app.logger.info(
                    'WhatsApp Meta envio OK. to=%s message_id=%s',
                    WhatsAppService._mask_phone(to_digits),
                    message_id,
                )
                return {
                    'success': True,
                    'message_id': message_id,
                }
        except HTTPError as exc:
            error_raw = ''
            try:
                error_raw = exc.read().decode('utf-8')
            except Exception:
                error_raw = ''

            error_payload = {}
            if error_raw:
                try:
                    error_payload = json.loads(error_raw)
                except (ValueError, json.JSONDecodeError):
                    error_payload = {'raw': error_raw}

            meta_error = error_payload.get('error', {}) if isinstance(error_payload, dict) else {}
            meta_message = meta_error.get('message') or str(exc)
            meta_code = meta_error.get('code')
            meta_subcode = meta_error.get('error_subcode')
            meta_trace = meta_error.get('fbtrace_id')

            current_app.logger.error(
                (
                    'WhatsApp Meta envio ERROR HTTP. to=%s status=%s code=%s subcode=%s '
                    'message=%s fbtrace_id=%s payload=%s'
                ),
                WhatsAppService._mask_phone(to_digits),
                getattr(exc, 'code', 'N/A'),
                meta_code,
                meta_subcode,
                meta_message,
                meta_trace,
                error_payload,
            )

            return {
                'success': False,
                'error': f'Error Meta HTTP {getattr(exc, "code", "N/A")}: {meta_message}',
                'provider_error': {
                    'status': getattr(exc, 'code', None),
                    'code': meta_code,
                    'subcode': meta_subcode,
                    'message': meta_message,
                    'fbtrace_id': meta_trace,
                },
            }
        except (URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            current_app.logger.exception(
                'WhatsApp Meta envio ERROR. to=%s error=%s',
                WhatsAppService._mask_phone(to_digits),
                str(exc),
            )
            return {
                'success': False,
                'error': f'Error enviando WhatsApp por Meta: {str(exc)}'
            }

    @staticmethod
    def _send_meta_template_message(to_phone, template_name, language_code='en_US', template_params=None):
        api_version = current_app.config.get('WHATSAPP_META_API_VERSION', 'v21.0')
        phone_number_id = current_app.config.get('WHATSAPP_META_PHONE_NUMBER_ID', '')
        access_token = current_app.config.get('WHATSAPP_META_ACCESS_TOKEN', '')
        timeout = int(current_app.config.get('WHATSAPP_REQUEST_TIMEOUT', 6))

        if not phone_number_id or not access_token:
            current_app.logger.warning(
                'WhatsApp Meta habilitado pero faltan credenciales (PHONE_NUMBER_ID/ACCESS_TOKEN).'
            )
            return {
                'success': False,
                'error': 'Credenciales incompletas de Meta WhatsApp Business Platform.'
            }

        template_name = str(template_name or '').strip()
        if not template_name:
            return {
                'success': False,
                'error': 'Template de WhatsApp no configurado.'
            }

        to_digits = re.sub(r'\D', '', str(to_phone or ''))
        if not to_digits:
            return {
                'success': False,
                'error': 'Numero destino invalido para Meta WhatsApp.'
            }

        language_code = str(language_code or 'en_US').strip() or 'en_US'

        template_payload = {
            'name': template_name,
            'language': {
                'code': language_code,
            },
        }

        clean_params = [item for item in (template_params or []) if str(item).strip()]
        if clean_params:
            parameters_payload = []
            for item in clean_params:
                if isinstance(item, dict):
                    param_name = str(item.get('parameter_name', '')).strip()
                    param_text = str(item.get('text', ''))
                    payload_item = {
                        'type': 'text',
                        'text': param_text,
                    }
                    if param_name:
                        payload_item['parameter_name'] = param_name
                    parameters_payload.append(payload_item)
                else:
                    parameters_payload.append({
                        'type': 'text',
                        'text': str(item),
                    })

            template_payload['components'] = [
                {
                    'type': 'body',
                    'parameters': parameters_payload,
                }
            ]

        payload = {
            'messaging_product': 'whatsapp',
            'to': to_digits,
            'type': 'template',
            'template': template_payload,
        }

        url = f'https://graph.facebook.com/{api_version}/{phone_number_id}/messages'
        payload_bytes = json.dumps(payload).encode('utf-8')
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        req = request.Request(url, data=payload_bytes, headers=headers, method='POST')

        current_app.logger.info(
            'WhatsApp Meta template envio iniciado. to=%s template=%s lang=%s params=%s timeout=%s api_version=%s',
            WhatsAppService._mask_phone(to_digits),
            template_name,
            language_code,
            len(clean_params),
            timeout,
            api_version,
        )

        try:
            with request.urlopen(req, timeout=timeout) as response:
                raw = response.read().decode('utf-8')
                data = json.loads(raw) if raw else {}
                message_id = None
                messages = data.get('messages') or []
                if messages and isinstance(messages, list):
                    message_id = messages[0].get('id')

                current_app.logger.info(
                    'WhatsApp Meta template envio OK. to=%s template=%s message_id=%s',
                    WhatsAppService._mask_phone(to_digits),
                    template_name,
                    message_id,
                )
                return {
                    'success': True,
                    'message_id': message_id,
                    'template_name': template_name,
                }
        except HTTPError as exc:
            error_raw = ''
            try:
                error_raw = exc.read().decode('utf-8')
            except Exception:
                error_raw = ''

            error_payload = {}
            if error_raw:
                try:
                    error_payload = json.loads(error_raw)
                except (ValueError, json.JSONDecodeError):
                    error_payload = {'raw': error_raw}

            meta_error = error_payload.get('error', {}) if isinstance(error_payload, dict) else {}
            meta_message = meta_error.get('message') or str(exc)
            meta_code = meta_error.get('code')
            meta_subcode = meta_error.get('error_subcode')
            meta_trace = meta_error.get('fbtrace_id')

            current_app.logger.error(
                (
                    'WhatsApp Meta template envio ERROR HTTP. to=%s template=%s status=%s code=%s '
                    'subcode=%s message=%s fbtrace_id=%s payload=%s'
                ),
                WhatsAppService._mask_phone(to_digits),
                template_name,
                getattr(exc, 'code', 'N/A'),
                meta_code,
                meta_subcode,
                meta_message,
                meta_trace,
                error_payload,
            )

            return {
                'success': False,
                'error': f'Error Meta HTTP {getattr(exc, "code", "N/A")}: {meta_message}',
                'provider_error': {
                    'status': getattr(exc, 'code', None),
                    'code': meta_code,
                    'subcode': meta_subcode,
                    'message': meta_message,
                    'fbtrace_id': meta_trace,
                },
            }
        except (URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            current_app.logger.exception(
                'WhatsApp Meta template envio ERROR. to=%s template=%s error=%s',
                WhatsAppService._mask_phone(to_digits),
                template_name,
                str(exc),
            )
            return {
                'success': False,
                'error': f'Error enviando WhatsApp template por Meta: {str(exc)}'
            }

    @staticmethod
    def _attach_meta_followup_text_if_enabled(primary_result, to_phone, data_text):
        if not WhatsAppService._is_truthy(
            current_app.config.get('WHATSAPP_META_SEND_DATA_TEXT_AFTER_TEMPLATE', True),
            default=True,
        ):
            return primary_result

        if not isinstance(primary_result, dict) or not primary_result.get('success'):
            return primary_result

        followup_result = WhatsAppService._send_meta_message(to_phone, data_text)
        merged = dict(primary_result)
        merged['data_text_followup'] = followup_result

        if not followup_result.get('success'):
            merged['success'] = False
            followup_error = followup_result.get('error', 'No se pudo enviar texto de detalle.')
            previous_error = merged.get('error')
            merged['error'] = (
                f'{previous_error} | followup: {followup_error}'
                if previous_error
                else f'followup: {followup_error}'
            )

        return merged

    @staticmethod
    def _send_message(to_phone, message_body, provider):
        if provider == 'meta':
            return WhatsAppService._send_meta_message(to_phone, message_body)

        if provider == 'twilio':
            return WhatsAppService._send_twilio_message(to_phone, message_body)

        return {
            'success': False,
            'error': f'Proveedor WhatsApp no soportado: {provider}'
        }

    @staticmethod
    def send_appointment_notifications(
        appointment,
        client,
        member,
        service_names,
        confirmation_phone=None,
        admin_phone_override=None,
    ):
        appointment_id = getattr(appointment, 'id', 'N/A')

        if not current_app.config.get('WHATSAPP_ENABLED', False):
            current_app.logger.info(
                'WhatsApp omitido para cita %s: WHATSAPP_ENABLED=false',
                appointment_id,
            )
            return {
                'success': True,
                'skipped': True,
                'reason': 'WhatsApp deshabilitado por configuracion.'
            }

        provider = current_app.config.get('WHATSAPP_PROVIDER', 'meta')
        if provider not in {'meta', 'twilio'}:
            current_app.logger.error(
                'WhatsApp proveedor invalido para cita %s: %s',
                appointment_id,
                provider,
            )
            return {
                'success': False,
                'error': f'Proveedor WhatsApp no soportado: {provider}'
            }

        source_confirmation_phone = confirmation_phone if confirmation_phone else getattr(client, 'phone_number', None)
        client_phone = WhatsAppService._normalize_phone(source_confirmation_phone)

        source_admin_phone = (
            admin_phone_override
            if admin_phone_override
            else current_app.config.get('WHATSAPP_ADMIN_PHONE', '')
        )
        admin_phone = WhatsAppService._normalize_phone(source_admin_phone)
        notify_client = WhatsAppService._is_truthy(current_app.config.get('WHATSAPP_NOTIFY_CLIENT', True), default=True)
        notify_admin = WhatsAppService._is_truthy(current_app.config.get('WHATSAPP_NOTIFY_ADMIN', True), default=True)

        services_text = WhatsAppService._build_services_text(service_names)
        scheduled_text = WhatsAppService._format_datetime(getattr(appointment, 'scheduled_date', None))
        member_name = getattr(member, 'full_name', 'No asignado')
        status_text = getattr(appointment, 'status', 'scheduled')
        notes_text = getattr(appointment, 'notes', None) or 'Sin notas'

        current_app.logger.info(
            'WhatsApp notificaciones iniciadas. cita=%s provider=%s client=%s admin=%s servicios=%s',
            appointment_id,
            provider,
            WhatsAppService._mask_phone(client_phone),
            WhatsAppService._mask_phone(admin_phone),
            len(service_names or []),
        )

        results = {
            'client_notification': None,
            'admin_notification': None,
        }

        template_context = {
            'appointment_id': getattr(appointment, 'id', 'N/A'),
            'client_name': getattr(client, 'name', 'cliente') or 'cliente',
            'scheduled_date': scheduled_text,
            'member_name': member_name,
            'services': services_text,
            'status': status_text,
            'client_phone': source_confirmation_phone or 'N/A',
            'client_email': getattr(client, 'email', 'N/A') or 'N/A',
            'notes': notes_text,
        }

        if notify_client and client_phone:
            client_message = (
                f'Hola {getattr(client, "name", "cliente")}, tu reserva fue confirmada.\n'
                f'Cita: #{getattr(appointment, "id", "N/A")}\n'
                f'Fecha: {scheduled_text}\n'
                f'Estilista: {member_name}\n'
                f'Servicios: {services_text}\n'
                f'Estado: {status_text}'
            )
            if provider == 'meta' and WhatsAppService._meta_template_is_enabled():
                client_template_name = current_app.config.get('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION', '')
                client_template_lang = current_app.config.get('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_LANG', 'en_US')
                client_param_keys = WhatsAppService._parse_template_param_keys(
                    current_app.config.get('WHATSAPP_META_TEMPLATE_APPOINTMENT_CONFIRMATION_PARAMS', ''),
                )
                client_template_params = WhatsAppService._resolve_template_params(client_param_keys, template_context)

                if client_template_name:
                    client_template_result = WhatsAppService._send_meta_template_message(
                        client_phone,
                        template_name=client_template_name,
                        language_code=client_template_lang,
                        template_params=client_template_params,
                    )
                    results['client_notification'] = WhatsAppService._attach_meta_followup_text_if_enabled(
                        client_template_result,
                        client_phone,
                        client_message,
                    )
                else:
                    results['client_notification'] = WhatsAppService._send_meta_message(client_phone, client_message)
            else:
                results['client_notification'] = WhatsAppService._send_message(client_phone, client_message, provider)
        elif not notify_client:
            results['client_notification'] = {
                'success': True,
                'skipped': True,
                'reason': 'Notificacion al cliente deshabilitada por configuracion.'
            }

        if notify_admin and admin_phone:
            admin_message = (
                'Nueva reserva registrada\n'
                f'Cita: #{getattr(appointment, "id", "N/A")}\n'
                f'Cliente: {getattr(client, "name", "N/A")}\n'
                f'Telefono cliente: {source_confirmation_phone or "N/A"}\n'
                f'Email cliente: {getattr(client, "email", "N/A") or "N/A"}\n'
                f'Fecha: {scheduled_text}\n'
                f'Estilista: {member_name}\n'
                f'Servicios: {services_text}\n'
                f'Notas: {notes_text}'
            )
            if provider == 'meta' and WhatsAppService._meta_template_is_enabled():
                admin_template_name = current_app.config.get('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT', '')
                admin_template_lang = current_app.config.get('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_LANG', 'en_US')
                admin_param_keys = WhatsAppService._parse_template_param_keys(
                    current_app.config.get('WHATSAPP_META_TEMPLATE_NEW_APPOINTMENT_PARAMS', ''),
                )
                admin_template_params = WhatsAppService._resolve_template_params(admin_param_keys, template_context)

                if admin_template_name:
                    admin_template_result = WhatsAppService._send_meta_template_message(
                        admin_phone,
                        template_name=admin_template_name,
                        language_code=admin_template_lang,
                        template_params=admin_template_params,
                    )
                    results['admin_notification'] = WhatsAppService._attach_meta_followup_text_if_enabled(
                        admin_template_result,
                        admin_phone,
                        admin_message,
                    )
                else:
                    results['admin_notification'] = WhatsAppService._send_meta_message(admin_phone, admin_message)
            else:
                results['admin_notification'] = WhatsAppService._send_message(admin_phone, admin_message, provider)
        elif not notify_admin:
            results['admin_notification'] = {
                'success': True,
                'skipped': True,
                'reason': 'Notificacion al administrador deshabilitada por configuracion.'
            }

        if notify_client and not client_phone:
            results['client_notification'] = {
                'success': False,
                'error': 'Cliente sin telefono valido para WhatsApp.'
            }
            current_app.logger.warning(
                'WhatsApp cliente omitido. cita=%s motivo=telefono_cliente_invalido',
                appointment_id,
            )

        if notify_admin and not admin_phone:
            results['admin_notification'] = {
                'success': False,
                'error': 'Telefono de administrador no configurado o invalido.'
            }
            current_app.logger.warning(
                'WhatsApp admin omitido. cita=%s motivo=telefono_admin_invalido',
                appointment_id,
            )

        current_app.logger.info(
            'WhatsApp notificaciones finalizadas. cita=%s client_success=%s admin_success=%s',
            appointment_id,
            bool((results.get('client_notification') or {}).get('success')),
            bool((results.get('admin_notification') or {}).get('success')),
        )

        client_success = bool((results.get('client_notification') or {}).get('success'))
        admin_success = bool((results.get('admin_notification') or {}).get('success'))
        required_destinations = []
        if notify_client:
            required_destinations.append('client_notification')
        if notify_admin:
            required_destinations.append('admin_notification')

        if not required_destinations:
            overall_success = True
        else:
            overall_success = all(
                bool((results.get(destination) or {}).get('success'))
                for destination in required_destinations
            )

        response = {
            'success': overall_success,
            'results': results,
            'partial_success': (notify_client and notify_admin and (client_success != admin_success)),
        }

        if not overall_success:
            errors = []
            client_error = (results.get('client_notification') or {}).get('error')
            admin_error = (results.get('admin_notification') or {}).get('error')
            if client_error:
                errors.append(f'cliente: {client_error}')
            if admin_error:
                errors.append(f'admin: {admin_error}')
            if errors:
                response['error'] = ' | '.join(errors)

        return response
