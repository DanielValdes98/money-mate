from sqlalchemy.orm import Session
from models.company import Company
from dto.company_dto import CompanyCreate, CompanyDBCreate

def get_all_companies(db: Session):
    return db.query(Company).all()

def get_companies_by_user_id(db: Session, user_id: int):
    return db.query(Company).filter(Company.user_id == user_id).all()

def create_company(db: Session, company: CompanyDBCreate):
    new_company = Company(**company.dict())
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

def get_company_by_ID(db: Session, company_id: int, user_id: int):
    return db.query(Company).filter(Company.id == company_id, Company.user_id == user_id).first()