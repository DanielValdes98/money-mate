from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default="now()", nullable=False)

    # Relación inversa
    transactions = relationship("Transaction", back_populates="user")
