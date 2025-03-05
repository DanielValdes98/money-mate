from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db

from models.user import User

from services.contact_service import create_contact_service, get_contacts_by_company_id_service
from dto.contact_dto import ContactCreate, ContactResponse

from typing import List
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

@router.get("/{company_id}/contacts", status_code=status.HTTP_201_CREATED, response_model=List[ContactResponse])
async def get_contacts_by_company_id(company_id: int, db: Session = Depends(get_db)):
    try:
        # Consultar los contactos asociados a la empresa
        contacts = get_contacts_by_company_id_service(db, company_id)

        # Convertir los objetos SQLAlchemy en diccionarios antes de loguearlos
        contact_list = [contact.__dict__ for contact in contacts]
        for contact in contact_list:
            contact.pop("_sa_instance_state", None)  # Remueve metadatos internos de SQLAlchemy
        
        # Log de los datos obtenidos
        logging.debug("\n📥 Contactos obtenidos en get_contacts_by_company_id 📥")
        logging.debug(contact_list) 

        # Convierte los objetos SQLAlchemy en objetos Pydantic 
        response_data = [
            ContactResponse(
                **{
                    **contact.__dict__,
                }
            )
            for contact in contacts
        ]

        logging.info(f"✅ Contactos obtenidos exitosamente: {len(response_data)}")
        return response_data

    except Exception as e:
        logging.error("❌ Error al obtener los contactos", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

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





