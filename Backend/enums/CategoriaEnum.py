from enum import Enum

class CategoriaEnum(str, Enum):
    COMIDA = "comida"
    RENTA = "renta"
    SALARIO = "salario"
    OTROS_INGRESOS = "otros_ingresos"
    OTROS_EGRESOS = "otros_egresos"
