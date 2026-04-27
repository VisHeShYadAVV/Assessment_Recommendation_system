from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.openai_service import OpenAIService
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize OpenAI service
try:
    ai_service = OpenAIService()
except ValueError as e:
    print(f"Warning: {e}")
    ai_service = None

class ChatRequest(BaseModel):
    message: str
    domain: str = "DSA"
    difficulty: str = "Medium"

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Handle chat requests from frontend.
    """
    if not ai_service:
        raise HTTPException(
            status_code=500,
            detail="AI service is not initialized. Please check OPENAI_API_KEY."
        )
    
    try:
        ai_reply = ai_service.generate_interview_response(
            user_message=request.message,
            domain=request.domain,
            difficulty=request.difficulty
        )
        return ChatResponse(reply=ai_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@router.post("/reset")
async def reset_chat():
    """Reset the conversation history"""
    if ai_service:
        ai_service.reset_conversation()
    return {"message": "Conversation reset successfully"}
