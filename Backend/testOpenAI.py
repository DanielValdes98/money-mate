import openai
import os
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv(dotenv_path="credentials.env")

# Crear una instancia del cliente OpenAI
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classify_message(message_text):
    """Clasifica un mensaje como ingreso o egreso usando OpenAI."""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Asegúrate de que este modelo esté disponible para ti
            messages=[
                {"role": "system", "content": "Eres un asistente que clasifica mensajes como ingreso o egreso."},
                {"role": "user", "content": message_text}
            ],
            max_tokens=50
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error al llamar a OpenAI: {e}")
        raise e

# Prueba
if __name__ == "__main__":
    test_message = "Hola, gasté 50 en comida"
    result = classify_message(test_message)
    print(f"Resultado: {result}")
