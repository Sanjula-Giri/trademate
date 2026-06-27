import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database.db import get_db
from models.models import Invoice, Job
from schemas.schemas import InvoiceCreate, InvoiceOut, InvoiceUpdate
from services.invoice_service import generate_invoice_pdf

router = APIRouter()


@router.get("/", response_model=list[InvoiceOut])
def get_invoices(db: Session = Depends(get_db)):
    return db.query(Invoice).options(joinedload(Invoice.job).joinedload(Job.customer)).order_by(Invoice.created_at.desc()).all()


@router.post("/", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db)):
    job = db.query(Job).options(joinedload(Job.customer)).filter(Job.id == data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    existing = db.query(Invoice).filter(Invoice.job_id == data.job_id).first()
    if existing:
        return existing

    amount = float(job.price or 0)
    gst = round(amount * 0.18, 2)
    total = round(amount + gst, 2)
    invoice = Invoice(job_id=job.id, amount=amount, gst=gst, total=total, paid=data.paid)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    invoice.pdf_path = generate_invoice_pdf({
        "invoice_id": invoice.id,
        "created_at": dt.datetime.utcnow().strftime("%d %b %Y"),
        "customer_name": job.customer.name,
        "customer_phone": job.customer.phone,
        "customer_address": job.customer.address,
        "service": job.service,
        "date": job.date,
        "time": job.time,
        "amount": amount,
        "gst": gst,
        "total": total,
    })
    db.commit()
    db.refresh(invoice)
    return invoice


@router.patch("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(invoice_id: int, data: InvoiceUpdate, db: Session = Depends(get_db)):
    invoice = db.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.paid = data.paid
    db.commit()
    db.refresh(invoice)
    return invoice
