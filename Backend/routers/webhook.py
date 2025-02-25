from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db import SessionLocal
from models.transaction import Transaction
from models.user import User

from utils import parse_gpt_response
from services.openai_service import classify_message
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/webhook")
async def webhook_test():
    return {"message": "Este endpoint admite GET para pruebas"}

@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        # Parsear el JSON recibido del webhook
        data = await request.json()

        # Validar estructura del webhook
        if "entry" not in data or not data["entry"]:
            raise HTTPException(status_code=400, detail="Estructura del webhook inválida")

        # Extraer datos relevantes
        entry = data["entry"][0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if not messages:
            return {"status": "ignored", "message": "Evento sin mensajes, no procesado"}

        # Procesar mensaje
        message = messages[0]
        user_phone = message.get("from")
        message_text = message.get("text", {}).get("body")

        if not user_phone or not message_text:
            raise HTTPException(
                status_code=400,
                detail="Estructura del mensaje incompleta. Falta 'from' o 'body'."
            )

        # Agregar '+' si no está presente
        if user_phone and not user_phone.startswith("+"):
            user_phone = "+" + user_phone
            
        # Verificar si el usuario ya existe en la base de datos
        user = db.query(User).filter(User.phone_number == user_phone).first()
        if not user:
            return {
                "status": "error",
                "message": "Usuario no registrado. Por favor registre el número antes de realizar transacciones.",
                "phone_number": user_phone,
            }

        # Intentar clasificar el mensaje con OpenAI
        try:
            classification, category_id, amount, description = classify_message(message_text, db)
        except Exception as e:
            # Manejar errores en la respuesta de OpenAI
            print(f"Error al llamar a OpenAI: {e}")
            return {
                "status": "error",
                "message": "No se pudo clasificar el mensaje. Por favor asegúrese de que contenga información relevante.",
            }

        # Registrar la transacción
        transaction = Transaction(
            user_id=user.id,
            category_id=category_id,
            amount=amount,
            description=description,
            type=classification,
            created_at=datetime.utcnow(),
        )
        db.add(transaction)
        db.commit()

        print("\n--- Datos procesados correctamente ---")
        print(f"Teléfono del usuario: {user_phone}")
        print(f"Mensaje de texto: {message_text}")
        print("-----------------------------------\n")

        return {"status": "success", "message": "Transacción registrada"}

    except HTTPException as e:
        raise e
    except Exception as e:
        # Manejo genérico de errores
        print(f"Error inesperado: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error inesperado al procesar la solicitud."
        )

@router.post("/auth/clerk-webhook")
async def clerk_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recibe eventos de Clerk (user.created y user.updated) y sincroniza con la base de datos.
    """
    try:
        payload = await request.json()
        print(f"[CLERK_WEBHOOK] Payload recibido: {payload}")  # Para depuración

        event_type = payload.get("type")
        data = payload.get("data")

        if not data:
            raise HTTPException(status_code=400, detail="Invalid Clerk user data")

        clerk_user_id = data.get("id")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        name = f"{first_name} {last_name}".strip()

        # Extraer email
        email = data["email_addresses"][0]["email_address"] if data.get("email_addresses") else None

        # Extraer número de teléfono
        phone_number = data["phone_numbers"][0]["phone_number"] if data.get("phone_numbers") else None

        if not clerk_user_id:
            raise HTTPException(status_code=400, detail="Invalid Clerk user ID")

        # Verificar si el usuario ya existe por email o clerk_user_id
        existing_user = db.query(User).filter(
            (User.clerk_user_id == clerk_user_id) | (User.email == email)
        ).first()

        if existing_user:
            # Si el usuario ya existe, actualizar sus datos
            existing_user.clerk_user_id = clerk_user_id
            existing_user.name = name or existing_user.name
            existing_user.email = email or existing_user.email
            existing_user.phone_number = phone_number or existing_user.phone_number
            db.commit()
            return {"message": "User updated successfully"}

        else:
            # Si no existe, crearlo
            new_user = User(
                clerk_user_id=clerk_user_id,
                name=name or "Sin Nombre",
                email=email,
                phone_number=phone_number,
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return {"message": "User created successfully"}

    except Exception as e:
        print(f"[CLERK_WEBHOOK] Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")