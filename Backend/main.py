from fastapi import FastAPI
from routers import webhook, transaction


app = FastAPI()

app.include_router(webhook.router, prefix="/api")
app.include_router(transaction.router, prefix="/api/transactions", tags=["Transactions"])
