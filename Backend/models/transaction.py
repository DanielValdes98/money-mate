from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(10), nullable=False)
    created_at = Column(TIMESTAMP, server_default="now()", nullable=False)

    # Relaciones
    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
