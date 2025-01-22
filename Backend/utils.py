def parse_gpt_response(response_text):
    """Procesa la respuesta de GPT para clasificar y extraer datos."""
    classification = None
    description = None
    amount = 0.0

    for line in response_text.split("\n"):
        if "clasificación" in line.lower():
            classification = line.split(":")[1].strip().lower()
        if "monto" in line.lower():
            try:
                amount = float(line.split(":")[1].strip())
            except ValueError:
                amount = 0.0
        if "descripción" in line.lower():
            description = line.split(":")[1].strip()

    return classification, description, amount

