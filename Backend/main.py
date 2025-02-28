from fastapi import FastAPI
from routers import webhook, transaction, company, contact


app = FastAPI()

app.include_router(webhook.router, prefix="/api")
app.include_router(transaction.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(company.router, prefix="/api/companies", tags=["Companies"])
app.include_router(contact.router, prefix="/api/contacts", tags=["Contacts"])

