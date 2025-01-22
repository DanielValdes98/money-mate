from fastapi import FastAPI
from routers import webhook

app = FastAPI()

app.include_router(webhook.router, prefix="/api")
