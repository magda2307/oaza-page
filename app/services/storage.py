import boto3
from botocore.config import Config
from app.config import settings


def _get_client():
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key,
        aws_secret_access_key=settings.r2_secret_key,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload bytes to R2 and return the public URL."""
    client = _get_client()
    client.put_object(
        Bucket=settings.r2_bucket,
        Key=filename,
        Body=file_bytes,
        ContentType=content_type,
    )
    return f"{settings.r2_public_url.rstrip('/')}/{filename}"
