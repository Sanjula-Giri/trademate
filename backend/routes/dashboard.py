import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from database.db import get_db
from models.models import Invoice, Job
from schemas.schemas import JobOut

router = APIRouter()


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    today = dt.date.today().isoformat()
    current_month = today[:7]
    total_revenue = db.query(func.sum(Invoice.total)).filter(Invoice.paid.is_(True)).scalar() or 0
    jobs_this_month = db.query(Job).filter(Job.date.startswith(current_month)).count()
    pending_jobs = db.query(Job).filter(Job.status == "pending").count()
    unpaid_invoices = db.query(Invoice).filter(Invoice.paid.is_(False)).count()
    todays_jobs = db.query(Job).options(joinedload(Job.customer)).filter(Job.date == today, Job.status != "cancelled").order_by(Job.time.asc()).all()
    return {
        "revenue": total_revenue,
        "jobs_this_month": jobs_this_month,
        "pending_jobs": pending_jobs,
        "unpaid_invoices": unpaid_invoices,
        "todays_jobs": [JobOut.model_validate(job).model_dump(mode="json") for job in todays_jobs],
    }
