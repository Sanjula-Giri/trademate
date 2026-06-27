import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = ""
    address: str = ""
    email: str = ""
    notes: str = ""


class CustomerCreate(CustomerBase):
    pass


class CustomerOut(CustomerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: dt.datetime


class JobBase(BaseModel):
    customer_id: int
    service: str = Field(..., min_length=1)
    status: str = "pending"
    date: str
    time: str
    price: float = 0
    priority: bool = False
    notes: str = ""


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    customer_id: Optional[int] = None
    service: Optional[str] = None
    status: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    price: Optional[float] = None
    priority: Optional[bool] = None
    notes: Optional[str] = None


class JobOut(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: dt.datetime
    customer: CustomerOut


class InvoiceCreate(BaseModel):
    job_id: int
    paid: bool = False


class InvoiceUpdate(BaseModel):
    paid: bool


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_id: int
    amount: float
    gst: float
    total: float
    paid: bool
    pdf_path: str
    created_at: dt.datetime
    job: JobOut


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
