from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    type = Column(String(10), nullable=False)
    created_at = Column(TIMESTAMP, server_default="now()", nullable=False)

    # Relación inversa
    transactions = relationship("Transaction", back_populates="category")
