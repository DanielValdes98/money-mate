from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base
from sqlalchemy.sql import func

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="contacts")
    company = relationship("Company", back_populates="contacts")
