import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

logger = logging.getLogger("oaza.email")


def _send_sync(to: str, subject: str, body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.email_from
    msg["To"] = to
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        if settings.smtp_tls:
            server.starttls()
        if settings.smtp_user:
            server.login(settings.smtp_user, settings.smtp_password)
        server.sendmail(settings.email_from, [to], msg.as_string())


def send_application_status_email(
    to_email: str,
    cat_name: str,
    status: str,
) -> None:
    """Fire-and-forget — call from a BackgroundTask. Silently logs on failure."""
    if not settings.smtp_host:
        return  # SMTP not configured — skip silently

    if status == "approved":
        subject = f"Twoja aplikacja adopcyjna – {cat_name} – zaakceptowana!"
        body = (
            f"Witaj,\n\n"
            f"Mamy wspaniałe wieści! Twoja aplikacja na adopcję kota {cat_name} "
            f"została zaakceptowana.\n\n"
            f"Skontaktujemy się z Tobą wkrótce, aby ustalić szczegóły.\n\n"
            f"Serdeczne pozdrowienia,\nZespół Kocia Oaza"
        )
    elif status == "rejected":
        subject = f"Twoja aplikacja adopcyjna – {cat_name}"
        body = (
            f"Witaj,\n\n"
            f"Dziękujemy za zainteresowanie adopcją kota {cat_name}.\n"
            f"Niestety tym razem nie możemy zaakceptować Twojej aplikacji.\n\n"
            f"Zachęcamy do zapoznania się z innymi kotami czekającymi na dom.\n\n"
            f"Serdeczne pozdrowienia,\nZespół Kocia Oaza"
        )
    else:
        return

    try:
        _send_sync(to_email, subject, body)
        logger.info("Email sent to %s for application status=%s cat=%s", to_email, status, cat_name)
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, e)
