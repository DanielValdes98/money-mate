from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from services.transaction_service import get_all_transactions, create_transaction
from dto.transaction_dto import TransactionCreate, TransactionResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(db: Session = Depends(get_db)):
    transactions = get_all_transactions(db)
    return transactions

@router.post("/", response_model=TransactionResponse)
async def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    new_transaction = create_transaction(db, transaction)
    return new_transaction
