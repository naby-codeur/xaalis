export function OverviewSkeleton() {
  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      aria-busy="true"
      aria-label="Chargement des métriques"
    >
      <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      <div className="mt-6 h-72 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
    </section>
  );
}
