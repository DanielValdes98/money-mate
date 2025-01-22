from db import Base, engine

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)
print("Tablas creadas exitosamente.")
