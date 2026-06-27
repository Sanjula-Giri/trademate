import datetime as dt
import os

import httpx
from fastapi import APIRouter

from schemas.schemas import ChatRequest

router = APIRouter()

SYSTEM_PROMPT = """
You are TradeMate AI, an office assistant for Ravi Kumar, a Delhi electrician.
Today's date is {today}. Working hours are 9 AM to 7 PM.

You help with jobs, customers, prices, appointment suggestions, invoice details,
and outstanding payments.

Rules:
- Be concise.
- Never make up customer data you have not been given.
- Suggest realistic Delhi market prices for electrical work.
- Always confirm before booking or cancelling appointments.
"""


@router.post("/")
async def chat(req: ChatRequest):
    today = dt.date.today().strftime("%d %B %Y")
    messages = [{"role": "system", "content": SYSTEM_PROMPT.format(today=today)}]
    messages.extend([message.model_dump() for message in req.history])
    messages.append({"role": "user", "content": req.message})
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "gemma3")
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(f"{ollama_url}/api/chat", json={"model": model, "messages": messages, "stream": False})
            res.raise_for_status()
        return {"reply": res.json()["message"]["content"]}
    except Exception:
        return {"reply": "I could not reach Ollama. Start Ollama locally and pull the gemma3 model to enable AI chat."}
