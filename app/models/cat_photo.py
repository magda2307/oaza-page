from pydantic import BaseModel


class CatPhotoOut(BaseModel):
    id: int
    cat_id: int
    url: str
    r2_key: str | None
    display_order: int
    is_primary: bool
