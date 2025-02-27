from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyBase(BaseModel):
    user_id: Optional[int] = None 
    clerk_user_id: str
    name: str
    description: Optional[str] = None
    profile_image: Optional[str] = None
    nit: str
    phone: str
    country: str
    website: Optional[str] = None
    created_at: Optional[datetime] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyDB(BaseModel):  # DTO solo con los campos que se guardan en la BD
    user_id: int
    name: str
    description: Optional[str] = None
    profile_image: Optional[str] = None
    nit: str
    phone: str
    country: str
    website: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class CompanyResponse(CompanyBase):
    id: int

