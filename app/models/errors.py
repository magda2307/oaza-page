from pydantic import BaseModel


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str
    code: str


class ErrorResponse(BaseModel):
    error: str
    message: str
    details: list[ErrorDetail] = []
