from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, String, TIMESTAMP
from sqlalchemy.orm import relationship
from models.base import Base
from sqlalchemy.sql import func

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    profile_image = Column(Text, nullable=True)
    nit = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    country = Column(String, nullable=False)
    website = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="companies")
    contacts = relationship("Contact", back_populates="company", cascade="all, delete, delete-orphan")
    events = relationship("Event", back_populates="company", cascade="all, delete, delete-orphan")


