import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.db import Base, engine
from routes import chat, customers, dashboard, invoices, jobs

Base.metadata.create_all(bind=engine)
app = FastAPI(title="TradeMate API", version="0.1.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_origin,
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        # allow the static landing page opened directly from disk or live-server
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "null",  # file:// origin browsers send as "null"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(jobs.router,      prefix="/jobs",      tags=["jobs"])
app.include_router(invoices.router,  prefix="/invoices",  tags=["invoices"])
app.include_router(chat.router,      prefix="/chat",      tags=["chat"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])


@app.get("/")
def root():
    return {"name": "TradeMate API", "status": "ok"}