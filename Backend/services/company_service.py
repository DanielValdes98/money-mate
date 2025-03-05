from sqlalchemy.orm import Session
from models.company import Company
from dto.company_dto import CompanyCreate, CompanyDB

import logging
logging.basicConfig(level=logging.DEBUG)

def get_all_companies(db: Session):
    return db.query(Company).all()

def get_companies_by_user_id(db: Session, user_id: int):
    return db.query(Company).filter(Company.user_id == user_id).all()

def create_company(db: Session, company: CompanyDB):
    new_company = Company(**company.dict())
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

def get_company_by_ID(db: Session, company_id: int, user_id: int):
    return db.query(Company).filter(Company.id == company_id, Company.user_id == user_id).first()

def modify_company(db: Session, company_id: int, company_data: CompanyDB):
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        return False

    update_data = company_data.dict(exclude_unset=True)

    # Si `profile_image` es un string vacío, cambiar a None
    if update_data.get("profile_image", "").strip() == "":
        update_data["profile_image"] = None

    # Verificar si hay cambios antes de actualizar
    if not any(getattr(company, k) != v for k, v in update_data.items()):
        return False  # No se realizaron cambios

    for key, value in update_data.items():
        setattr(company, key, value)

    try:
        db.commit()
        db.refresh(company)
        return True
    except:
        db.rollback()
        return False

def delete_company_service(db: Session, company_id: int):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return False
    
    db.delete(company)
    db.commit()
    return True
    
