import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from database.db import get_db
from models.models import Customer, Invoice, Job
from schemas.schemas import JobOut

router = APIRouter()


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    today = dt.date.today().isoformat()   # "YYYY-MM-DD"
    current_month = today[:7]             # "YYYY-MM"

    # ── All-time revenue (paid invoices) ──────────────────────────────
    total_revenue = (
        db.query(func.sum(Invoice.total))
        .filter(Invoice.paid.is_(True))
        .scalar() or 0
    )

    # ── Revenue this month (paid invoices whose job falls this month) ──
    revenue_this_month = (
        db.query(func.sum(Invoice.total))
        .join(Job, Invoice.job_id == Job.id)
        .filter(Invoice.paid.is_(True), Job.date.startswith(current_month))
        .scalar() or 0
    )

    # ── Job counts ────────────────────────────────────────────────────
    jobs_this_month = (
        db.query(Job)
        .filter(Job.date.startswith(current_month))
        .count()
    )
    pending_jobs = (
        db.query(Job)
        .filter(Job.status == "pending")
        .count()
    )

    # ── Invoice counts ────────────────────────────────────────────────
    unpaid_invoices = (
        db.query(Invoice)
        .filter(Invoice.paid.is_(False))
        .count()
    )

    # ── Today's jobs (customer eager-loaded) ──────────────────────────
    todays_jobs = (
        db.query(Job)
        .options(joinedload(Job.customer))
        .filter(Job.date == today, Job.status != "cancelled")
        .order_by(Job.time.asc())
        .all()
    )

    # ── Repeat customer rate ──────────────────────────────────────────
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    repeat_subq = (
        db.query(Job.customer_id)
        .group_by(Job.customer_id)
        .having(func.count(Job.id) > 1)
        .subquery()
    )
    repeat_customers = (
        db.query(func.count()).select_from(repeat_subq).scalar() or 0
    )
    repeat_rate = (
        round(repeat_customers / total_customers * 100) if total_customers else 0
    )

    return {
        # consumed by Next.js dashboard page
        "revenue":            total_revenue,
        "jobs_this_month":    jobs_this_month,
        "pending_jobs":       pending_jobs,
        "unpaid_invoices":    unpaid_invoices,
        "todays_jobs": [
            JobOut.model_validate(job).model_dump(mode="json")
            for job in todays_jobs
        ],
        # consumed by landing page JS fetch
        "revenue_this_month":    revenue_this_month,
        "jobs_today":            len(todays_jobs),
        "repeat_customer_rate":  repeat_rate,
    }