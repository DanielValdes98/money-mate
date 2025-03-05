import openai
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models.category import Category

# Cargar las variables de entorno desde 'credentials.env'
load_dotenv(dotenv_path="credentials.env")

# Crear una instancia del cliente OpenAI utilizando la clave API
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classify_message(message_text, db: Session):
    """
    Clasifica un mensaje como 'ingreso' o 'egreso', asigna categoría desde la base de datos,
    extrae el monto y proporciona una descripción.
    """
    try:
        # Obtener las categorías desde la base de datos
        categories = db.query(Category).all()
        category_names = {category.name.lower(): category.id for category in categories}

        # Crear un prompt dinámico con las categorías disponibles
        categories_prompt = ", ".join(category_names.keys())

        # Llamada a OpenAI
        response = client.chat.completions.create(
            model="gpt-4o", # Modelo: gpt-3.5-turbo, gpt-4o
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Eres un asistente que clasifica mensajes como 'ingreso' o 'egreso'. "
                        f"Extrae el monto o valor en precio del mensaje, asigna una categoría basada en estas opciones: {categories_prompt}, "
                        f"y proporciona una descripción breve de la transacción según el contexto. "
                        f"Devuelve siempre la respuesta en este formato EXACTO (no incluyas nada más):\n\n"
                        f"Tipo: [Ingreso o Egreso]\n"
                        f"Monto: $[Monto o valor]\n"
                        f"Categoría: [Categoría]\n"
                        f"Descripción: [Breve descripción del mensaje].\n\n"
                        f"Si no puedes categorizar, usa 'Otros ingresos' para ingresos y 'Otros egresos' para egresos."
                    )
                },
                {"role": "user", "content": message_text}
            ],
            max_tokens=200
        )

        # Procesar la respuesta del modelo
        content = response.choices[0].message.content.strip()

        # **Mostrar el contenido en la consola**
        print("\n--- OpenAI Content ---")
        print(content)
        print("----------------------\n")

        # Validar que la respuesta cumpla con el formato
        if not all(key in content.lower() for key in ["tipo", "monto", "categoría", "descripción"]):
            raise ValueError("La respuesta del modelo no contiene todas las claves necesarias.")

        # Extraer datos del texto procesado
        lines = content.split("\n")
        classification = None
        category_name = None
        amount = 0.0
        description = ""

        for line in lines:
            if "tipo" in line.lower():
                classification = line.split(":")[1].strip().lower()
            if "categoría" in line.lower():
                category_name = line.split(":")[1].strip().lower()
            if "monto" in line.lower():
                try:
                    amount = float(line.split(":")[1].strip().replace("$", ""))
                except ValueError:
                    amount = 0.0
            if "descripción" in line.lower():
                description = line.split(":")[1].strip()

        # Validar categoría y asignar ID desde la base de datos
        if category_name not in category_names:
            category_name = "otros ingresos" if classification == "ingreso" else "otros egresos"

        category_id = category_names.get(category_name)

        return classification, category_id, amount, description
    # except Exception as e:
    #     print(f"Error al llamar a OpenAI: {e}")
    #     raise e
    except openai.error.OpenAIError as oe:
        print(f"Error de OpenAI: {oe}")
        raise ValueError("Error al llamar al modelo de OpenAI.")

    except ValueError as ve:
        print(f"Error de validación: {ve}")
        raise ve

    except Exception as e:
        print(f"Error inesperado: {e}")
        raise RuntimeError("Ocurrió un error inesperado al clasificar el mensaje.")
