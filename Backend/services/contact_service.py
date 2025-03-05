from sqlalchemy.orm import Session
from models.contact import Contact
from dto.contact_dto import ContactCreate, ContactDB

import logging
logging.basicConfig(level=logging.DEBUG)

def get_contacts_by_company_id_service(db: Session, company_id: int):
    return db.query(Contact).filter(Contact.company_id == company_id).all()

def create_contact_service(db: Session, user_id: int, contact_data: ContactCreate):
    """
    Crea un contacto asociado a una empresa
    """
    try:
        # Convertir el DTO a modelo de base de datos
        new_contact = Contact(
            user_id=user_id,
            company_id=contact_data.company_id, 
            name=contact_data.name,
            role=contact_data.role,
            email=contact_data.email,
            phone=contact_data.phone
        )

        # Guardar en la base de datos
        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)

        return new_contact

    except Exception as e:
        db.rollback()
        raise e


