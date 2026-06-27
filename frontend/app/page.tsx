"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { StatCard } from "@/components/StatCard";
import { Dashboard, fetchDashboard } from "@/lib/api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  useEffect(() => { fetchDashboard().then(setDashboard).catch(() => setDashboard(null)); }, []);
  return (
    <div className="space-y-6">
      <section><h1 className="text-2xl font-semibold text-ink">Dashboard</h1><p className="mt-1 text-sm text-slate-600">Today's work, revenue, and assistant in one place.</p></section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paid revenue" value={"Rs " + (dashboard?.revenue || 0).toLocaleString("en-IN")} />
        <StatCard label="Jobs this month" value={String(dashboard?.jobs_this_month || 0)} />
        <StatCard label="Pending jobs" value={String(dashboard?.pending_jobs || 0)} />
        <StatCard label="Unpaid invoices" value={String(dashboard?.unpaid_invoices || 0)} />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-line bg-white">
          <div className="border-b border-line px-4 py-3"><h2 className="font-semibold text-ink">Today's Jobs</h2></div>
          <div className="divide-y divide-line">
            {dashboard?.todays_jobs?.length ? dashboard.todays_jobs.map((job) => (
              <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div><p className="font-medium text-ink">{job.service}</p><p className="text-sm text-slate-600">{job.customer.name}</p></div>
                <div className="text-right text-sm"><p className="font-medium">{job.time}</p><p className="text-slate-600">Rs {job.price.toLocaleString("en-IN")}</p></div>
              </div>
            )) : <p className="px-4 py-8 text-sm text-slate-600">No jobs scheduled for today.</p>}
          </div>
        </div>
        <ChatPanel />
      </section>
    </div>
  );
}
