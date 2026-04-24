import { getOverviewMetrics } from "@/lib/metrics-server";

export default async function ReportsPage() {
  const overview = await getOverviewMetrics();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Rapports
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        En mode dev, les donnees sont mockees via l'API metrics.
      </p>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Serie recue: {overview.series.length} points
        </p>
      </div>
    </section>
  );
}
