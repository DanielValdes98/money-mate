from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from models.base import Base
from sqlalchemy.sql import func

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    start = Column(TIMESTAMP, nullable=False)
    all_day = Column(Boolean, nullable=False)
    time_format = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    company = relationship("Company", back_populates="events")
