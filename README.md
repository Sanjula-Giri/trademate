# TradeMate AI

TradeMate AI is a starter full-stack app for managing customers, jobs, invoices, a calendar, and a local AI assistant.

## Run the backend

cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload

Backend URL: http://localhost:8000

## Run the frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Frontend URL: http://localhost:3000

## Optional AI chat

Install Ollama, then run:

ollama pull gemma3
ollama serve

The chat panel will work once Ollama is reachable at http://localhost:11434.
