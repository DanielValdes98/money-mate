from sqlalchemy.orm import Session
from models.transaction import Transaction
from dto.transaction_dto import TransactionCreate

def get_all_transactions(db: Session):
    return db.query(Transaction).all()

def create_transaction(db: Session, transaction: TransactionCreate):
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction
