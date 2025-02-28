from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Base model con los campos comunes
class ContactBase(BaseModel):
    name: str
    role: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: str

# DTO para la creación de un contacto (se recibe desde el frontend)
class ContactCreate(ContactBase):
    clerk_user_id: str  
    company_id: int  

# DTO para la BD, con los campos internos del backend
class ContactDB(ContactBase):
    user_id: int  # Se obtiene desde la base de datos usando `clerk_user_id`
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Para permitir la conversión desde ORM a Pydantic

# DTO de respuesta cuando se consulta un contacto
class ContactResponse(ContactDB):
    id: int 
