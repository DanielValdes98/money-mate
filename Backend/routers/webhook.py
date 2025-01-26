from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db import SessionLocal, Transaction, User
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