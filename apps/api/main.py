from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine          # ← absolute import
from routers import auth                   # ← absolute import

app = FastAPI(title="NEVILINQ API", version="1.0.0")

FRONTENDS = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTENDS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True, "service": "NEVILINQ API"}

# create tables
Base.metadata.create_all(bind=engine)

# routes
app.include_router(auth.router)
