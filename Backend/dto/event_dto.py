from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    start: datetime
    all_day: bool
    time_format: Optional[str] = None
    description: Optional[str] = None

class EventCreate(EventBase):
    company_id: int  

class EventDB(EventBase):
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  

class EventResponse(EventDB):
    id: int 
