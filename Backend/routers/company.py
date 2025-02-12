from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from services.company_service import get_all_companies, create_company
from dto.company_dto import CompanyCreate, CompanyResponse, CompanyDBCreate
from models.user import User
from typing import List
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

@router.get("/", response_model=List[CompanyResponse])
async def get_companies(db: Session = Depends(get_db)):
    companies = get_all_companies(db)
    return companies

@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_company(company: CompanyCreate, db: Session = Depends(get_db)):
    try:
        # Busca el user_id en la BBDD basado en clerk_user_id
        user = db.query(User).filter(User.clerk_user_id == company.clerk_user_id).first() # TODO: Se debe crear el servicio para user y modificar esta línea
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Asigna el user_id encontrado al objeto company
        company_data = company.dict()
        company_data["user_id"] = user.id 

        # Eliminar clerk_user_id porque la tabla `companies` no lo usa
        company_data.pop("clerk_user_id", None) 

        logging.debug("\n\n\n📥📥📥 Datos procesados en company_data 📥📥📥 %s \n\n\n", company_data)

        # Servicio para crear la empresa
        create_company(db, CompanyDBCreate(**company_data))

        return {"message": "Company created successfully"}

    except Exception as e:
        logging.error("Error al crear la empresa:", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
