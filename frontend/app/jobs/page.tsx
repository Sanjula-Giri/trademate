"use client";

import { FormEvent, useEffect, useState } from "react";
import { Customer, Job, createInvoice, createJob, fetchCustomers, fetchJobs, fileUrl } from "@/lib/api";

export default function JobsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoiceLinks, setInvoiceLinks] = useState<Record<number, string>>({});
  const [form, setForm] = useState({ customer_id: "", service: "", status: "pending", date: new Date().toISOString().slice(0, 10), time: "10:00", price: "0", priority: false, notes: "" });
  function load() { fetchCustomers().then(setCustomers).catch(() => setCustomers([])); fetchJobs().then(setJobs).catch(() => setJobs([])); }
  useEffect(load, []);
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.customer_id || !form.service.trim()) return;
    await createJob({ customer_id: Number(form.customer_id), service: form.service, status: form.status, date: form.date, time: form.time, price: Number(form.price || 0), priority: form.priority, notes: form.notes });
    setForm({ ...form, service: "", price: "0", notes: "" });
    load();
  }
  async function makeInvoice(jobId: number) {
    const invoice = await createInvoice(jobId);
    setInvoiceLinks((current) => ({ ...current, [jobId]: fileUrl(invoice.pdf_path) }));
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-lg border border-line bg-white p-4">
        <h1 className="text-xl font-semibold text-ink">New Job</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Customer<select className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
          <label className="block text-sm font-medium text-slate-700">Service<input className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Date<input type="date" className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label className="block text-sm font-medium text-slate-700">Time<input type="time" className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label></div>
          <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Price<input type="number" className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label><label className="block text-sm font-medium text-slate-700">Status<select className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label></div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.checked })} />Priority job</label>
          <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Add job</button>
        </form>
      </section>
      <section className="rounded-lg border border-line bg-white">
        <div className="border-b border-line px-4 py-3"><h2 className="font-semibold text-ink">Jobs</h2></div>
        <div className="divide-y divide-line">
          {jobs.map((job) => <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"><div><p className="font-medium text-ink">{job.service}</p><p className="text-sm text-slate-600">{job.customer.name} - {job.date} at {job.time}</p><p className="mt-1 text-xs uppercase text-slate-500">{job.status.replace("_", " ")}</p></div><div className="flex items-center gap-3"><p className="font-medium">Rs {job.price.toLocaleString("en-IN")}</p>{invoiceLinks[job.id] ? <a className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-slate-50" href={invoiceLinks[job.id]} target="_blank">PDF</a> : <button className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => makeInvoice(job.id)}>Invoice</button>}</div></div>)}
          {!jobs.length && <p className="px-4 py-8 text-sm text-slate-600">No jobs yet.</p>}
        </div>
      </section>
    </div>
  );
}
