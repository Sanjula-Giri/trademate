"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Job, fetchJobs } from "@/lib/api";

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: {} });

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => { fetchJobs().then(setJobs).catch(() => setJobs([])); }, []);
  const events = useMemo(() => jobs.map((job) => { const start = new Date(job.date + "T" + job.time); const end = new Date(start.getTime() + 60 * 60 * 1000); return { title: job.customer.name + " - " + job.service, start, end, resource: job.status }; }), [jobs]);
  return (
    <div className="space-y-4">
      <section><h1 className="text-2xl font-semibold text-ink">Calendar</h1><p className="mt-1 text-sm text-slate-600">Scheduled jobs shown by date and time.</p></section>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 680 }} />
    </div>
  );
}
