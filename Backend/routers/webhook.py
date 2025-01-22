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
    # Parsear el JSON recibido del webhook
    data = await request.json()

    # Testing: Imprimir los datos que llegan al webhook en la consola
    print("\n--- Data (Webhook - Glitch) ---")
    print(f"Data: {data}")
    print("-----------------------------------\n")
    
    try:
        # Extraer el valor de "messages" de la estructura
        entry = data.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        # Validar si hay mensajes en la estructura
        if not messages:
            raise HTTPException(status_code=400, detail="No se recibieron mensajes")

        # Extraer los campos relevantes del primer mensaje
        message = messages[0]
        user_phone = message.get("from")  # Número de teléfono del remitente
        message_text = message.get("text", {}).get("body")  # Texto del mensaje

        # Verificar si el usuario ya existe en la base de datos
        user = db.query(User).filter(User.phone_number == user_phone).first()

        if not user:
            # Responder indicando que el usuario no está registrado
            return {
                "status": "error",
                "message": "Usuario no registrado. Por favor registre el número antes de realizar transacciones.",
                "phone_number": user_phone,
            }

        # *** Aquí puedes descomentar la lógica para clasificar y registrar transacciones si es necesario ***
        # classification, category_id, amount, description = classify_message(message_text, db)
        # transaction = Transaction(
        #     user_id=user.id,
        #     category_id=category_id,
        #     amount=amount,
        #     description=description,
        #     type=classification,
        #     created_at=datetime.utcnow(),
        # )
        # db.add(transaction)
        # db.commit()

        # Para pruebas: Mostrar los datos en consola
        print("\n--- Datos deserializados ---")
        print(f"Teléfono del usuario: {user_phone}")
        print(f"Mensaje de texto: {message_text}")
        print("-----------------------------------\n")

        return {"status": "success", "message": "Datos procesados correctamente"}

    except IntegrityError as e:
        # Manejo de errores relacionados con la base de datos
        db.rollback()
        print(f"Error de integridad de la base de datos: {e}")
        raise HTTPException(
            status_code=500, detail="Error al registrar la transacción"
        )
    except Exception as e:
        # Manejo genérico de excepciones
        print(f"Error al procesar la solicitud: {e}")
        raise HTTPException(
            status_code=500, detail="Ocurrió un error al procesar la solicitud"
        )

