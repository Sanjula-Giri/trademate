const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Customer = { id: number; name: string; phone: string; address: string; email: string; notes: string; created_at: string };
export type Job = { id: number; customer_id: number; service: string; status: string; date: string; time: string; price: number; priority: boolean; notes: string; created_at: string; customer: Customer };
export type Invoice = { id: number; job_id: number; amount: number; gst: number; total: number; paid: boolean; pdf_path: string; created_at: string; job: Job };
export type Dashboard = { revenue: number; jobs_this_month: number; pending_jobs: number; unpaid_invoices: number; todays_jobs: Job[] };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const fetchDashboard = () => request<Dashboard>("/dashboard/");
export const fetchCustomers = () => request<Customer[]>("/customers/");
export const createCustomer = (data: Omit<Customer, "id" | "created_at">) => request<Customer>("/customers/", { method: "POST", body: JSON.stringify(data) });
export const fetchJobs = () => request<Job[]>("/jobs/");
export const createJob = (data: { customer_id: number; service: string; status: string; date: string; time: string; price: number; priority: boolean; notes: string }) => request<Job>("/jobs/", { method: "POST", body: JSON.stringify(data) });
export const createInvoice = (jobId: number) => request<Invoice>("/invoices/", { method: "POST", body: JSON.stringify({ job_id: jobId }) });
export const sendChat = (message: string, history: { role: string; content: string }[]) => request<{ reply: string }>("/chat/", { method: "POST", body: JSON.stringify({ message, history }) });
export const fileUrl = (path: string) => BASE_URL + path;
