from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db

from models.user import User

from services.contact_service import create_contact_service
from dto.contact_dto import ContactCreate, ContactResponse

from typing import List
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

@router.post("/{company_id}/contact", status_code=status.HTTP_201_CREATED, response_model=ContactResponse)
async def create_contact(contact_data: ContactCreate, db: Session = Depends(get_db)):
    try:
        # Validar que el usuario exista en la base de datos
        user = db.query(User).filter(User.clerk_user_id == contact_data.clerk_user_id).first()
        if not user:
            logging.warning(f"❌ Usuario no encontrado: {contact_data.clerk_user_id}")
            raise HTTPException(status_code=404, detail="User not found")

        # Log de entrada con estructura ordenada
        logging.debug("\n📥 Contacto recibido en create_contact 📥")
        logging.debug(contact_data.dict())  # Imprime cada campo de forma más legible

        new_contact = create_contact_service(db, user.id, contact_data)

        logging.info(f"✅ Contacto creado exitosamente: Id {new_contact.id} - {new_contact.name}")

        return new_contact
    except Exception as e:
        logging.error("❌ Error al crear el contacto", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")





