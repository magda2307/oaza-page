import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.dependencies import require_admin
from app.services.storage import upload_file
from app.config import settings
from pydantic import BaseModel

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


class UploadResponse(BaseModel):
    url: str


@router.post("/upload", response_model=UploadResponse,
             dependencies=[Depends(require_admin)])
async def upload_photo(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {file.content_type}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds 10 MB limit",
        )

    if not settings.r2_account_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storage is not configured",
        )

    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "jpg"
    filename = f"cats/{uuid.uuid4()}.{ext}"
    url = upload_file(contents, filename, file.content_type)
    return UploadResponse(url=url)
