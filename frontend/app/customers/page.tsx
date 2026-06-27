"use client";

import { FormEvent, useEffect, useState } from "react";
import { Customer, createCustomer, fetchCustomers } from "@/lib/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "", notes: "" });
  function load() { fetchCustomers().then(setCustomers).catch(() => setCustomers([])); }
  useEffect(load, []);
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;
    await createCustomer(form);
    setForm({ name: "", phone: "", address: "", email: "", notes: "" });
    load();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-line bg-white p-4">
        <h1 className="text-xl font-semibold text-ink">New Customer</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Name<input className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-medium text-slate-700">Phone<input className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="block text-sm font-medium text-slate-700">Address<input className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label className="block text-sm font-medium text-slate-700">Email<input className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="block text-sm font-medium text-slate-700">Notes<textarea className="mt-1 min-h-24 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Add customer</button>
        </form>
      </section>
      <section className="rounded-lg border border-line bg-white">
        <div className="border-b border-line px-4 py-3"><h2 className="font-semibold text-ink">Customers</h2></div>
        <div className="divide-y divide-line">
          {customers.map((customer) => <div key={customer.id} className="px-4 py-3"><p className="font-medium text-ink">{customer.name}</p><p className="text-sm text-slate-600">{customer.phone || "No phone"}</p><p className="mt-1 text-sm text-slate-600">{customer.address}</p></div>)}
          {!customers.length && <p className="px-4 py-8 text-sm text-slate-600">No customers yet.</p>}
        </div>
      </section>
    </div>
  );
}
