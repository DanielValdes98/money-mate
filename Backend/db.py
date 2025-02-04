import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv(dotenv_path="credentials.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("La variable de entorno DATABASE_URL no está definida.")

# Configuración avanzada de logging
formatter = logging.Formatter(
    "\n[%(asctime)s] [%(levelname)s] [%(name)s]:\n%(message)s\n",  # Formato con espaciado
    datefmt="%Y-%m-%d %H:%M:%S"  # Formato de fecha y hora
)

console_handler = logging.StreamHandler()  # Handler para la consola
console_handler.setFormatter(formatter)  # Asignar el formato personalizado

sqlalchemy_logger = logging.getLogger("sqlalchemy.engine")
sqlalchemy_logger.setLevel(logging.INFO)  # Nivel de logging para SQLAlchemy
sqlalchemy_logger.addHandler(console_handler)  # Agregar el handler al logger

# Configurar la conexión a PostgreSQL
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Función para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
