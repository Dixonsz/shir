import base64
import re
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from urllib import parse, request
from urllib.parse import urlencode

from flask import current_app


class NotificationService:

    @staticmethod
    def _is_truthy(value, default=True):
        if value is None:
            return default
        if isinstance(value, bool):
            return value
        return str(value).strip().lower() in {'1', 'true', 'yes', 'y', 'on'}

    @staticmethod
    def _normalize_phone(phone_raw, default_country_code):
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

        default_digits = re.sub(r'\D', '', str(default_country_code or '+57'))
        if not default_digits:
            default_digits = '57'

        return f'+{default_digits}{digits}'

    @staticmethod
    def _mask_phone(phone_value):
        if not phone_value:
            return 'N/A'

        digits = re.sub(r'\D', '', str(phone_value))
        if len(digits) <= 4:
            return f'***{digits}' if digits else 'N/A'
        return f'+***{digits[-4:]}'

    @staticmethod
    def _format_datetime(value):
        if value is None:
            return 'No definida'
        try:
            return value.strftime('%d/%m/%Y %H:%M')
        except Exception:
            return str(value)

    @staticmethod
    def _resolve_member_name(member):
        if member is None:
            return 'N/A'

        full_name = getattr(member, 'full_name', None)
        if full_name:
            return str(full_name).strip()

        first_name = str(getattr(member, 'first_name', '') or '').strip()
        last_name = str(getattr(member, 'last_name', '') or '').strip()
        joined = f'{first_name} {last_name}'.strip()
        if joined:
            return joined

        fallback_name = getattr(member, 'name', None)
        if fallback_name:
            return str(fallback_name).strip()

        return 'N/A'

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
    def _build_google_calendar_link(
        appointment,
        client,
        member_name,
        services_text,
        notes_text,
        scheduled_value,
        duration_minutes,
        location,
    ):
        if not scheduled_value:
            return None

        start_dt = scheduled_value
        if isinstance(start_dt, str):
            try:
                start_dt = datetime.fromisoformat(start_dt.replace('Z', '+00:00'))
            except Exception:
                return None

        if not isinstance(start_dt, datetime):
            return None

        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)

        duration = int(duration_minutes or 60)
        if duration <= 0:
            duration = 60

        end_dt = start_dt + timedelta(minutes=duration)
        start_utc = start_dt.astimezone(timezone.utc)
        end_utc = end_dt.astimezone(timezone.utc)

        appointment_id = getattr(appointment, 'id', 'N/A')
        details = (
            f'Cita #{appointment_id}\n'
            f'Cliente: {getattr(client, "name", "N/A")}\n'
            f'Correo cliente: {getattr(client, "email", "N/A")}\n'
            f'Telefono cliente: {getattr(client, "phone_number", "N/A")}\n'
            f'Estilista: {member_name}\n'
            f'Servicios: {services_text}\n'
            f'Notas: {notes_text}'
        )
        title = f'Cita #{appointment_id} - {getattr(client, "name", "Cliente")}'

        params = {
            'action': 'TEMPLATE',
            'text': title,
            'dates': f'{start_utc.strftime("%Y%m%dT%H%M%SZ")}/{end_utc.strftime("%Y%m%dT%H%M%SZ")}',
            'details': details,
            'location': location or 'Salon',
        }
        return f'https://calendar.google.com/calendar/render?{urlencode(params)}'

    @staticmethod
    def _send_sms_twilio(to_phone, message_body):
        account_sid = current_app.config.get('SMS_TWILIO_ACCOUNT_SID', '').strip()
        auth_token = current_app.config.get('SMS_TWILIO_AUTH_TOKEN', '').strip()
        from_phone = str(current_app.config.get('SMS_TWILIO_FROM', '')).strip()
        timeout = int(current_app.config.get('SMS_REQUEST_TIMEOUT', 6))

        if not account_sid or not auth_token or not from_phone:
            return {
                'success': False,
                'error': 'Credenciales incompletas para SMS Twilio.',
            }

        url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json'
        payload = parse.urlencode(
            {
                'From': from_phone,
                'To': to_phone,
                'Body': message_body,
            }
        ).encode('utf-8')
        basic_auth = base64.b64encode(f'{account_sid}:{auth_token}'.encode('utf-8')).decode('ascii')
        headers = {
            'Authorization': f'Basic {basic_auth}',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        req = request.Request(url, data=payload, headers=headers, method='POST')

        try:
            with request.urlopen(req, timeout=timeout) as response:
                raw = response.read().decode('utf-8')
                match = re.search(r'"sid"\s*:\s*"([^"]+)"', raw)
                return {
                    'success': True,
                    'provider': 'twilio',
                    'message_sid': match.group(1) if match else None,
                }
        except Exception as exc:
            return {
                'success': False,
                'error': f'Error enviando SMS: {str(exc)}',
            }

    @staticmethod
    def _send_sms(to_phone, message_body):
        provider = str(current_app.config.get('SMS_PROVIDER', 'twilio')).strip().lower()
        if provider != 'twilio':
            return {
                'success': False,
                'error': f'Proveedor SMS no soportado: {provider}',
            }
        return NotificationService._send_sms_twilio(to_phone, message_body)

    @staticmethod
    def _send_email(to_email, subject, body):
        smtp_host = str(current_app.config.get('EMAIL_SMTP_HOST', '')).strip()
        smtp_port = int(current_app.config.get('EMAIL_SMTP_PORT', 587))
        smtp_username = str(current_app.config.get('EMAIL_SMTP_USERNAME', '')).strip()
        smtp_password = str(current_app.config.get('EMAIL_SMTP_PASSWORD', '')).strip()
        from_email = str(current_app.config.get('EMAIL_FROM', smtp_username)).strip()
        use_tls = NotificationService._is_truthy(current_app.config.get('EMAIL_USE_TLS', True), default=True)
        use_ssl = NotificationService._is_truthy(current_app.config.get('EMAIL_USE_SSL', False), default=False)

        if not smtp_host or not from_email:
            return {
                'success': False,
                'error': 'Configuracion SMTP incompleta (EMAIL_SMTP_HOST/EMAIL_FROM).',
            }

        message = EmailMessage()
        message['Subject'] = subject
        message['From'] = from_email
        message['To'] = to_email
        message.set_content(body)

        try:
            if use_ssl:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=8) as server:
                    if smtp_username:
                        server.login(smtp_username, smtp_password)
                    server.send_message(message)
            else:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=8) as server:
                    if use_tls:
                        server.starttls()
                    if smtp_username:
                        server.login(smtp_username, smtp_password)
                    server.send_message(message)

            return {'success': True}
        except Exception as exc:
            return {
                'success': False,
                'error': f'Error enviando correo: {str(exc)}',
            }

    @staticmethod
    def send_appointment_notifications(
        appointment,
        client,
        member,
        service_names=None,
        confirmation_phone=None,
        admin_notification_email=None,
        scheduled_date_override=None,
        notify_client=None,
        notify_admin=None,
        admin_ics_duration_minutes=None,
        admin_ics_location=None,
        admin_calendar_link_enabled=None,
    ):
        service_names = service_names or []
        results = {
            'success': True,
            'sms': {},
            'email': {},
        }

        scheduled_value = scheduled_date_override or getattr(appointment, 'scheduled_date', None)
        scheduled_text = NotificationService._format_datetime(scheduled_value)
        member_name = NotificationService._resolve_member_name(member)
        services_text = NotificationService._build_services_text(service_names)
        status_text = getattr(appointment, 'status', 'scheduled')
        notes_text = getattr(appointment, 'notes', None) or 'Sin notas'

        if current_app.config.get('SMS_ENABLED', False):
            default_code = current_app.config.get('SMS_DEFAULT_COUNTRY_CODE', '+57')
            client_phone_source = confirmation_phone or getattr(client, 'phone_number', None)
            admin_phone_source = (
                current_app.config.get('SMS_ADMIN_PHONE', '')
                or getattr(member, 'phone_number', None)
            )
            client_phone = NotificationService._normalize_phone(client_phone_source, default_code)
            admin_phone = NotificationService._normalize_phone(admin_phone_source, default_code)

            sms_notify_client = NotificationService._is_truthy(
                notify_client if notify_client is not None else current_app.config.get('SMS_NOTIFY_CLIENT', True),
                True,
            )
            sms_notify_admin = NotificationService._is_truthy(
                notify_admin if notify_admin is not None else current_app.config.get('SMS_NOTIFY_ADMIN', True),
                True,
            )

            if sms_notify_client and client_phone:
                client_sms = (
                    f'Hola {getattr(client, "name", "cliente")}, tu cita #{getattr(appointment, "id", "N/A")} '
                    f'esta confirmada para {scheduled_text}. Estilista: {member_name}. '
                    f'Servicios: {services_text}.'
                )
                results['sms']['client'] = NotificationService._send_sms(client_phone, client_sms)
            elif sms_notify_client:
                results['sms']['client'] = {
                    'success': False,
                    'error': 'Cliente sin telefono valido para SMS.',
                }

            if sms_notify_admin and admin_phone:
                admin_sms = (
                    f'Nueva cita #{getattr(appointment, "id", "N/A")} para {scheduled_text}. '
                    f'Cliente: {getattr(client, "name", "N/A")}. Estilista: {member_name}. '
                    f'Servicios: {services_text}.'
                )
                results['sms']['admin'] = NotificationService._send_sms(admin_phone, admin_sms)
            elif sms_notify_admin:
                results['sms']['admin'] = {
                    'success': False,
                    'error': 'Admin sin telefono valido para SMS.',
                }

        if current_app.config.get('EMAIL_ENABLED', False):
            notify_client_email = NotificationService._is_truthy(
                notify_client if notify_client is not None else current_app.config.get('EMAIL_NOTIFY_CLIENT', True),
                True,
            )
            notify_admin_email = NotificationService._is_truthy(
                notify_admin if notify_admin is not None else current_app.config.get('EMAIL_NOTIFY_ADMIN', True),
                True,
            )
            admin_to = (
                str(admin_notification_email or '').strip()
                or str(current_app.config.get('EMAIL_ADMIN_TO', '')).strip()
                or str(current_app.config.get('DEFAULT_MEMBER_EMAIL', '')).strip()
            )
            subject_prefix = str(current_app.config.get('EMAIL_SUBJECT_PREFIX', '[Salon]')).strip()

            shared_body = (
                f'Cita: #{getattr(appointment, "id", "N/A")}\n'
                f'Cliente: {getattr(client, "name", "N/A")}\n'
                f'Correo: {getattr(client, "email", "N/A")}\n'
                f'Telefono: {getattr(client, "phone_number", "N/A")}\n'
                f'Estilista: {member_name}\n'
                f'Fecha y hora: {scheduled_text}\n'
                f'Estado: {status_text}\n'
                f'Servicios: {services_text}\n'
            )

            if notify_client_email and getattr(client, 'email', None):
                subject_client = f'{subject_prefix} Confirmacion de cita #{getattr(appointment, "id", "N/A")}'
                body_client = (
                    f'Hola {getattr(client, "name", "cliente")},\n\n'
                    'Tu reserva fue registrada correctamente.\n\n'
                    f'{shared_body}\n'
                    'Gracias por preferirnos.'
                )
                results['email']['client'] = NotificationService._send_email(client.email, subject_client, body_client)
            elif notify_client_email:
                results['email']['client'] = {
                    'success': False,
                    'error': 'Cliente sin correo electronico valido.',
                }

            if notify_admin_email and admin_to:
                subject_admin = f'{subject_prefix} Nueva cita #{getattr(appointment, "id", "N/A")}'
                body_admin = f'Se registro una nueva cita:\n\n{shared_body}'
                event_duration = (
                    admin_ics_duration_minutes
                    if admin_ics_duration_minutes is not None
                    else current_app.config.get('EMAIL_ADMIN_ICS_DURATION_MINUTES', 60)
                )
                event_location = (
                    admin_ics_location
                    if admin_ics_location is not None
                    else current_app.config.get('EMAIL_ADMIN_ICS_LOCATION', 'Salon')
                )

                raw_calendar_link_enabled = (
                    current_app.config.get('EMAIL_ADMIN_CALENDAR_LINK_ENABLED', True)
                    if admin_calendar_link_enabled is None
                    else admin_calendar_link_enabled
                )
                calendar_link_enabled = NotificationService._is_truthy(raw_calendar_link_enabled, True)
                if calendar_link_enabled:
                    calendar_link = NotificationService._build_google_calendar_link(
                        appointment=appointment,
                        client=client,
                        member_name=member_name,
                        services_text=services_text,
                        notes_text=notes_text,
                        scheduled_value=scheduled_value,
                        duration_minutes=event_duration,
                        location=event_location,
                    )
                    if calendar_link:
                        body_admin += f'\n\nAgregar al calendario:\n{calendar_link}'

                results['email']['admin'] = NotificationService._send_email(
                    admin_to,
                    subject_admin,
                    body_admin,
                )
            elif notify_admin_email:
                results['email']['admin'] = {
                    'success': False,
                    'error': 'No hay correo de administrador configurado.',
                }

        all_channel_results = []
        for channel in ('sms', 'email'):
            channel_data = results.get(channel, {})
            for _, channel_result in channel_data.items():
                all_channel_results.append(channel_result.get('success', False))

        if all_channel_results and not any(all_channel_results):
            results['success'] = False

        return results
