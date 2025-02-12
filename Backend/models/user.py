from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone_number = Column(String(20), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default="now()", nullable=False)

    # Relación inversa
    transactions = relationship("Transaction", back_populates="user")
    companies = relationship("Company", back_populates="user", cascade="all, delete, delete-orphan")
    contacts = relationship("Contact", back_populates="user", cascade="all, delete, delete-orphan")

