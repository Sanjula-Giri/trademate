<div align="center">

```
████████╗██████╗  █████╗ ██████╗ ███████╗███╗   ███╗ █████╗ ████████╗███████╗
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
   ██║   ██████╔╝███████║██║  ██║█████╗  ██╔████╔██║███████║   ██║   █████╗  
   ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  
   ██║   ██║  ██║██║  ██║██████╔╝███████╗██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
                                     AI
```

**A business operating system for solo tradespeople.**  
AI receptionist · job scheduling · CRM · invoicing · analytics — all in one.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama_Gemma_3-FF6B35?style=flat-square&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)


[Live Demo](#) · [API Docs](#api-reference) · [7-Day Build Plan](#-7-day-build-roadmap) · [Report Bug](#)

</div>

---

## The problem

Solo electricians, plumbers, and carpenters in India lose nearly **48% of their working day** to admin work. They miss calls while on a job, forget appointments, send no reminders, track payments in notebooks, and have zero customer history.

Marketplace apps connect them to customers — but leave the actual business management completely unsolved.

**TradeMate AI is a business OS, not a marketplace.** It handles everything that happens after the customer says "yes."

---

## What it does

| Feature | Status | Description |
|---|---|---|
| 📞 AI Receptionist | `MVP` | Handles missed calls, books appointments, answers FAQs automatically |
| 📅 Smart Scheduling | `MVP` | Books, reschedules, and cancels jobs with AI route suggestions |
| 👥 Customer CRM | `MVP` | Full history — jobs, payments, notes, warranties per customer |
| 🧾 Invoice Generator | `MVP` | One-click PDF invoices with GST, tracked paid vs outstanding |
| 📊 Analytics Dashboard | `MVP` | Revenue, job count, repeat customer rate, top services |
| 🤖 AI Chat Assistant | `MVP` | Answers pricing questions, suggests schedules, drafts invoices |
| 🔔 Smart Reminders | `MVP` | Pre-job alerts to customer + owner via APScheduler |
| 🗣️ Voice Notes | `v2` | Whisper STT converts spoken field notes into reminders |
| 🗺️ Route Optimisation | `planned` | Google Maps API — arrange daily jobs by geography |
| 📦 Inventory Tracking | `planned` | Log materials, alert when stock drops below threshold |

---

## Architecture

```
Customer
    │
    ▼
┌──────────────────────────────────┐
│        Next.js 14 Frontend       │  ← TypeScript · Tailwind · shadcn/ui
│   Dashboard │ Jobs │ Calendar    │
│   CRM │ Invoices │ AI Assistant  │
└─────────────────┬────────────────┘
                  │ REST API
                  ▼
┌──────────────────────────────────┐
│         FastAPI Backend          │  ← Python · SQLAlchemy · Pydantic
│   /customers  /jobs  /invoices   │
│   /dashboard  /chat  /notify     │
└────────┬──────────┬──────────────┘
         │          │
    ┌────▼────┐  ┌──▼──────────────────────────┐
    │ SQLite  │  │  Services                    │
    │  (dev)  │  │  ├── Ollama (Gemma 3) — AI   │
    │  → PG   │  │  ├── WeasyPrint — PDF        │
    │ (prod)  │  │  └── APScheduler — reminders │
    └─────────┘  └─────────────────────────────┘
```

---

## Quick start

**Prerequisites:** Python 3.11+, Node.js 18+, [Ollama](https://ollama.com)

```bash
# 1. Clone
git clone https://github.com/yourusername/trademate-ai
cd trademate-ai

# 2. Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
# → API live at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs

# 3. AI model
ollama pull gemma3
# Downloads ~5 GB. Runs at localhost:11434

# 4. Frontend
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
# → App live at http://localhost:3000
```

---

## Tech stack

### Frontend

```
next@14          App Router, server + client components
typescript       Strict mode throughout
tailwindcss      Utility-first styling
shadcn/ui        Accessible component library
react-big-calendar  Calendar view (Day 3)
react-hook-form  Form handling + validation
recharts         Analytics charts
axios            API client
```

### Backend

```
fastapi          Async web framework, auto-generated /docs
sqlalchemy       ORM — swap SQLite → PostgreSQL by changing one env var
pydantic v2      Request/response schema validation
uvicorn          ASGI server
httpx            Async HTTP client for Ollama calls
weasyprint       HTML → PDF for invoice generation
jinja2           Invoice HTML templating
apscheduler      In-process cron jobs for reminders
python-dotenv    Environment config
```

### AI

```
ollama           Local LLM runtime — no API key needed
gemma3           Recommended model (~5 GB, fast, Hindi/English mix)
llama3           Alternative — stronger reasoning, larger
mistral          Alternative — better at structured JSON output
```

> **The secret to a good AI feature:** inject live business context into every system prompt — today's jobs, pending payments, customer names. This is what makes the AI feel "aware" of the business rather than answering generically.

---

## Project structure

```
trademate-ai/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/page.tsx        ← overview + live metrics
│   │   ├── jobs/page.tsx             ← searchable job table
│   │   ├── calendar/page.tsx         ← react-big-calendar view
│   │   ├── customers/page.tsx        ← CRM with history
│   │   ├── invoices/page.tsx         ← invoice list + generator
│   │   └── assistant/page.tsx        ← AI chat interface
│   ├── components/
│   │   ├── sidebar.tsx
│   │   ├── job-card.tsx
│   │   └── chat-widget.tsx
│   └── lib/
│       └── api.ts                    ← all fetch calls in one place
│
└── backend/
    ├── main.py                       ← FastAPI app + CORS + router mount
    ├── models/
    │   └── models.py                 ← Customer, Job, Invoice, Notification
    ├── schemas/
    │   └── schemas.py                ← Pydantic in/out models
    ├── routes/
    │   ├── customers.py
    │   ├── jobs.py
    │   ├── invoices.py
    │   ├── chat.py                   ← Ollama proxy + prompt builder
    │   └── dashboard.py              ← aggregated stats endpoint
    ├── services/
    │   ├── invoice_service.py        ← WeasyPrint PDF generation
    │   └── ai_service.py             ← system prompt builder
    ├── templates/
    │   └── invoice.html              ← Jinja2 invoice template
    └── database/
        └── db.py                     ← engine, session, get_db
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/customers` | List all customers with job counts |
| `POST` | `/customers` | Create a new customer record |
| `PUT` | `/customers/{id}` | Update name, phone, address, notes |
| `DELETE` | `/customers/{id}` | Remove customer (soft delete) |
| `GET` | `/jobs` | List jobs — filter by `status`, `date`, `customer_id` |
| `POST` | `/jobs` | Create a job linked to a customer |
| `PUT` | `/jobs/{id}` | Update status, reschedule, mark priority |
| `DELETE` | `/jobs/{id}` | Cancel a job |
| `GET` | `/dashboard` | Aggregated stats — revenue, counts, today's jobs |
| `POST` | `/chat` | Send `{message, history}` to Ollama, returns AI reply |
| `POST` | `/invoices/generate` | Generate PDF invoice — returns download URL |
| `GET` | `/invoices` | List invoices — filter by `paid`, `overdue` |

Full interactive docs available at `http://localhost:8000/docs` when running locally.

---

## 🗓️ 7-day build roadmap

<details>
<summary><strong>Day 1 — Scaffold + database</strong></summary>

- Create folder structure (`frontend/` and `backend/`)
- Init Next.js 14 with TypeScript + Tailwind CSS
- Init FastAPI project + Python virtual environment
- Create SQLite database with SQLAlchemy
- Define `Customer`, `Job`, `Invoice`, `Notification` models
- Verify connection — run `uvicorn` and check `/docs`

</details>

<details>
<summary><strong>Day 2 — CRUD routes + frontend shell</strong></summary>

- Write all REST routes for customers and jobs
- Write Pydantic schemas for request/response validation
- Build sidebar navigation in Next.js
- Build Dashboard page skeleton with empty metric cards
- Connect frontend to backend via `lib/api.ts`
- Test: create a customer and job via Swagger

</details>

<details>
<summary><strong>Day 3 — Calendar + job management</strong></summary>

- Install `react-big-calendar` + `date-fns`
- Wire calendar to jobs API — display jobs as events
- Colour-code events by status (pending → in progress → done)
- Build Add Job form with `react-hook-form`
- Build Job list page with search + status filter
- Add update-status action on job cards

</details>

<details>
<summary><strong>Day 4 — Invoice generator (PDF)</strong></summary>

- Install WeasyPrint + Jinja2
- Create `invoice.html` template (customer, service, price, GST, total)
- Write `invoice_service.py` — renders HTML → PDF
- Add `POST /invoices/generate` route
- Add download link on job detail page
- Test: generate and download a real PDF

</details>

<details>
<summary><strong>Day 5 — AI assistant (Ollama)</strong></summary>

- Install Ollama, pull `gemma3` (~5 GB)
- Write `POST /chat` — sends message + history to Ollama
- Build system prompt with live business context injection
- Build chat UI component (message bubbles + input)
- Wire quick-ask buttons (price quote, pending payments, book slot)
- Test: full multi-turn conversation with job booking

</details>

<details>
<summary><strong>Day 6 — Smart features + dashboard</strong></summary>

- Build dashboard aggregation endpoint (revenue, jobs, today)
- Wire real data into metric cards + charts (recharts)
- Add APScheduler — daily 8 AM briefing + pre-job reminders
- Add AI route-suggestion prompt (batch nearby jobs)
- Add low-inventory alert when stock drops below threshold
- Polish: empty states, loading skeletons, error messages

</details>

<details>
<summary><strong>Day 7 — Polish + mobile responsive</strong></summary>

- Mobile-responsive layout (sidebar → hamburger menu)
- Dark mode support via Tailwind `dark:` classes
- Business settings page (name, working hours, GST number)
- Fix all TypeScript errors + console warnings
- Screenshot every page for demo and README

</details>

<details>
<summary><strong>Day 8 — Testing + deployment</strong></summary>

- Write basic API tests with `pytest`
- Deploy frontend to Vercel (connect GitHub repo)
- Deploy backend to Railway (add `Procfile` + env vars)
- Set `NEXT_PUBLIC_API_URL` to Railway domain in Vercel
- Smoke test all flows on production URLs
- Record a 2-minute demo video for portfolio

</details>

---

## Deployment

**Frontend → Vercel**

```bash
cd frontend
vercel deploy
# Set NEXT_PUBLIC_API_URL=https://your-api.railway.app in Vercel dashboard
```

**Backend → Railway**

```
# Procfile (place in /backend)
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Push to GitHub → connect repo in Railway → add `DATABASE_URL` environment variable → deploy.

**Database:** Start with SQLite (zero setup). Switch to PostgreSQL (Neon or Supabase free tier) for production by changing one env var — SQLAlchemy handles the rest.

---

## Environment variables

**`backend/.env`**
```env
DATABASE_URL=sqlite:///./trademate.db
OLLAMA_URL=http://localhost:11434
BUSINESS_NAME=Ravi Kumar Electricals
BUSINESS_PHONE=+91 98100 XXXXX
GST_NUMBER=07AAAAA0000A1Z5
WORKING_HOURS_START=09:00
WORKING_HOURS_END=19:00
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Roadmap

- [x] Customer CRM (create, edit, history)
- [x] Job scheduling + status tracking
- [x] Calendar view (day / week / month)
- [x] PDF invoice generation with GST
- [x] AI chat assistant (Ollama + Gemma 3)
- [x] Analytics dashboard (revenue, jobs, repeat customers)
- [x] In-app reminders (APScheduler)
- [ ] WhatsApp API integration (send invoices + reminders)
- [ ] Voice notes → reminders (Whisper STT)
- [ ] Route optimisation (Google Maps API)
- [ ] Inventory and stock tracking
- [ ] Customer-facing booking portal
- [ ] QR payment generation

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a PR against main
```

---



---

<div align="center">

Built with purpose for India's 50 million solo tradespeople.

**⭐ Star this repo if it helped you learn something.**

</div>
