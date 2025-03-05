from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db

from models.user import User

from services.event_service import create_event_service, get_events_by_user_id_service, get_event_by_id_service, delete_event_service
from dto.event_dto import EventCreate, EventResponse

from typing import List
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

@router.get("/user/{clerk_user_id}", response_model=List[EventResponse])
async def get_events_by_user_id(clerk_user_id: str, db: Session = Depends(get_db)):
    try:
        # Buscar el usuario por clerk_user_id
        user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first() # TODO: Se debe crear el servicio para user y modificar esta línea
        if not user:
            logging.warning(f"❌ Usuario no encontrado: {clerk_user_id}")
            raise HTTPException(status_code=404, detail="User not found")

        events = get_events_by_user_id_service(db, user.id)
        response_data = [
            EventResponse(
                **{
                    **event.__dict__,
                }
            )
            for event in events
        ]

        logging.debug(f"📤 Eventos obtenidos en get_events_by_user_id 📤")
        logging.debug(response_data)

        logging.info(f"✅ Eventos obtenidos: {len(response_data)}")
        return response_data

    except Exception as e:
        logging.error("❌ Error al obtener los eventos:", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=EventResponse)
async def create_event(event_data: EventCreate, db: Session = Depends(get_db)):
    try:
        # Log de entrada con estructura ordenada
        logging.debug("\n📥 Evento recibido en create_event 📥")
        logging.debug(event_data.dict()) 

        new_event = create_event_service(db, event_data)

        logging.info(f"✅ Evento creado exitosamente: Id {new_event.id} - {new_event.title}")
        return new_event

    except Exception as e:
        logging.error("❌ Error al crear el evento", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{eventId}", status_code=status.HTTP_200_OK)
async def delete_event(eventId: int, db: Session = Depends(get_db)):
    try:
        event_db = get_event_by_id_service(db, eventId)
        if not event_db:
            logging.warning(f"❌ Evento no encontrado: {eventId}")
            raise HTTPException(status_code=404, detail="Event not found")

        deleted = delete_event_service(db, eventId)
        if not deleted:
            raise HTTPException(status_code=400, detail="Delete failed")

        logging.info(f"✅ Se ha eliminado el evento '{event_db.title}' (ID: {eventId})")
        return {"message": "Event deleted successfully"}

    except Exception as e:
        logging.error("❌ Error al eliminar el evento", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")


