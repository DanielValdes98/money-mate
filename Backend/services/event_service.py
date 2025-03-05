from sqlalchemy.orm import Session
from models.event import Event
from models.company import Company
from dto.event_dto import EventCreate, EventDB

import logging
logging.basicConfig(level=logging.DEBUG)

def get_events_by_user_id_service(db: Session, user_id: int):
    # Obtener IDs de las empresas del usuario
    company_ids = [company.id for company in db.query(Company).filter(Company.user_id == user_id).all()]

    if not company_ids:
        return []  # Si el usuario no tiene empresas asociadas, retorna lista vacía

    # Consultar eventos asociados a esas empresas
    events = db.query(Event).filter(Event.company_id.in_(company_ids)).all()

    return events

def create_event_service(db: Session, event_data: EventCreate):
    try:
        # Convertir el DTO a modelo de base de datos
        new_event = Event(
            company_id=event_data.company_id, 
            title=event_data.title,
            start=event_data.start,
            all_day=event_data.all_day,
            time_format=event_data.time_format,
            description=event_data.description
        )

        # Guardar en la base de datos
        db.add(new_event)
        db.commit()
        db.refresh(new_event)

        return new_event

    except Exception as e:
        db.rollback()
        raise e

def get_event_by_id_service(db: Session, eventId: int):
    return db.query(Event).filter(Event.id == eventId).first()

def delete_event_service(db: Session, eventId: int):
    event = db.query(Event).filter(Event.id == eventId).first()
    if not event:
        return False
    
    db.delete(event)
    db.commit()
    return True
    