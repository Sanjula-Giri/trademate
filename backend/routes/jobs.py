import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from database.db import get_db
from models.models import Customer, Job
from schemas.schemas import JobCreate, JobOut, JobUpdate

router = APIRouter()


def _get_job_or_404(job_id: int, db: Session) -> Job:
    job = (
        db.query(Job)
        .options(joinedload(Job.customer))
        .filter(Job.id == job_id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/", response_model=list[JobOut])
def get_jobs(
    db: Session = Depends(get_db),
    status_filter: str = Query(None, alias="status"),
    date: str = Query(None),
    customer_id: int = Query(None),
    limit: int = Query(50),
):
    q = db.query(Job).options(joinedload(Job.customer))
    if status_filter:
        q = q.filter(Job.status == status_filter)
    if date == "today":
        q = q.filter(Job.date == dt.date.today().isoformat())
    elif date:
        q = q.filter(Job.date == date)
    if customer_id:
        q = q.filter(Job.customer_id == customer_id)
    return q.order_by(Job.date.asc(), Job.time.asc()).limit(limit).all()


@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    if not db.get(Customer, data.customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    job = Job(**data.model_dump())
    db.add(job)
    db.commit()
    # reload with customer so JobOut serialises correctly
    return _get_job_or_404(job.id, db)


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    return _get_job_or_404(job_id, db)


@router.patch("/{job_id}", response_model=JobOut)
def update_job(job_id: int, data: JobUpdate, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    updates = data.model_dump(exclude_unset=True)
    if "customer_id" in updates and not db.get(Customer, updates["customer_id"]):
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in updates.items():
        setattr(job, key, value)
    db.commit()
    # reload with customer so JobOut serialises correctly
    return _get_job_or_404(job_id, db)


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"ok": True}