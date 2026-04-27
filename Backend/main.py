from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.recommend_route import router as recommend_router
from routes.chat_route import router as chat_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# CORS (important for Streamlit)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register routes
app.include_router(recommend_router)
app.include_router(chat_router)


# uvicorn main:app --reload --port 8000