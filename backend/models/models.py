import datetime as dt

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database.db import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    phone = Column(String, default="")
    address = Column(String, default="")
    email = Column(String, default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    jobs = relationship("Job", back_populates="customer", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    service = Column(String, nullable=False)
    status = Column(String, default="pending")
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    price = Column(Float, default=0)
    priority = Column(Boolean, default=False)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    customer = relationship("Customer", back_populates="jobs")
    invoice = relationship("Invoice", back_populates="job", uselist=False, cascade="all, delete-orphan")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, unique=True)
    amount = Column(Float, nullable=False)
    gst = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    paid = Column(Boolean, default=False)
    pdf_path = Column(String, default="")
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    job = relationship("Job", back_populates="invoice")
