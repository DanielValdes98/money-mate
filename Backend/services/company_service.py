from sqlalchemy.orm import Session
from models.company import Company
from dto.company_dto import CompanyCreate, CompanyDBCreate

def get_all_companies(db: Session):
    return db.query(Company).all()

def create_company(db: Session, company: CompanyDBCreate):
    new_company = Company(**company.dict())
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company
