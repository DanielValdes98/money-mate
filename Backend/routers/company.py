from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from services.company_service import get_all_companies, create_company, get_companies_by_user_id, get_company_by_ID, modify_company
from dto.company_dto import CompanyCreate, CompanyResponse, CompanyDB
from models.user import User
from typing import List
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

@router.get("/user/{clerk_user_id}", response_model=List[CompanyResponse])
async def get_companies_by_clerk_user_id(clerk_user_id: str, db: Session = Depends(get_db)):
    try:
        # Buscar el usuario por clerk_user_id
        user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first() # TODO: Se debe crear el servicio para user y modificar esta línea
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Consultar las empresas asociadas al usuario
        companies = get_companies_by_user_id(db, user.id)

        # Convertir cada empresa a CompanyResponse e incluir clerk_user_id
        response_data = [
            CompanyResponse(
                **{
                    **company.__dict__,
                    "clerk_user_id": user.clerk_user_id,
                    "profile_image": company.profile_image.strip() if (company.profile_image or "").strip() else None, 
                }
            )
            for company in companies
        ]

        logging.debug("\n\n📥📥📥 response_data en get_companies_by_clerk_user_id 📥📥📥 %s \n\n", response_data)
        return response_data

    except Exception as e:
        logging.error("Error al obtener empresas:", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

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

        # Asegurar que profile_image sea None si es un string vacío
        if not company_data.get("profile_image") or company_data["profile_image"].strip() == "":
            company_data["profile_image"] = None

        # Eliminar clerk_user_id porque la tabla `companies` no lo usa
        company_data.pop("clerk_user_id", None) 

        logging.debug("\n\n\n📥📥📥 company_data en add_company 📥📥📥 %s \n\n\n", company_data)

        # Servicio para crear la empresa
        create_company(db, CompanyDB(**company_data))

        return {"message": "Company created successfully"}

    except Exception as e:
        logging.error("Error al crear la empresa:", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{company_id}/user/{clerk_user_id}", response_model=CompanyResponse)
async def get_company_by_id(company_id: int, clerk_user_id: str, db: Session = Depends(get_db)):
    try:
        # Buscar el usuario por clerk_user_id
        user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first() # TODO: Se debe crear el servicio para user y modificar esta línea
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Buscar la empresa por id y user_id
        company = get_company_by_ID(db, company_id, user.id)
        if not company: 
            raise HTTPException(status_code=404, detail="Company not found")

        # Convertir la empresa a DTO CompanyResponse e incluir clerk_user_id
        company_response = CompanyResponse(
                **{
                    **company.__dict__,
                    "clerk_user_id": user.clerk_user_id,
                    "profile_image": company.profile_image.strip() if (company.profile_image or "").strip() else None, 
                }
        )

        logging.debug("\n\n📥📥📥 company_response en get_company_by_id 📥📥📥 %s \n\n", company_response)
        return company_response

    except Exception as e:
        logging.error("Error al obtener la empresa: ", exc_info=True)
        raise HTTPException(status_code=500, detail = "Internal Server Error")

@router.patch("/{company_id}/user/{clerk_user_id}", status_code=status.HTTP_200_OK)
async def update_company(company_id: int, clerk_user_id: str, company: CompanyResponse, db: Session = Depends(get_db)):
    try:
        # Buscar el usuario por clerk_user_id
        user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first() # TODO: Se debe crear el servicio para user y modificar esta línea
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Buscar la empresa por id y user_id
        company_db = get_company_by_ID(db, company_id, user.id)
        if not company_db: 
            raise HTTPException(status_code=404, detail="Company not found")

        # Elimina clerk_user_id porque la tabla `companies` no lo usa
        company_data = company.dict(exclude_unset=True, exclude={"created_at", "clerk_user_id"})

        # Actualizar la empresa
        logging.debug("\n\n📥📥📥 company_data en update_company 📥📥📥 %s \n\n", company_data)
        updated = modify_company(db, company_id, CompanyDB(**company_data))
        logging.debug("\n\n📥📥📥 updated in update_company 📥📥📥 %s \n\n", updated)

        if not updated:
            raise HTTPException(status_code=400, detail="Update failed")

        return {"message": "Company updated successfully"}

    except Exception as e:
        logging.error("Error al actualizar la empresa:", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
