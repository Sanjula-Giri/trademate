# TradeMate API

FastAPI backend for TradeMate AI.

Run locally:

cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload

The API runs at http://localhost:8000.

Optional AI chat support needs Ollama running locally:

ollama pull gemma3
ollama serve
