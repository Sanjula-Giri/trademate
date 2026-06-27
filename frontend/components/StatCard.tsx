type StatCardProps = { label: string; value: string };

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
