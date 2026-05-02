import { xaGlassPanel } from "@/lib/xaalis-ui";

export function OverviewSkeleton() {
  return (
    <section
      className={xaGlassPanel}
      aria-busy="true"
      aria-label="Chargement des métriques"
    >
      <div className="h-6 w-48 animate-pulse rounded-lg bg-gradient-to-r from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-zinc-800" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-violet-50/80 dark:bg-zinc-800/80" />
      <div className="mt-6 h-72 w-full animate-pulse rounded-xl bg-gradient-to-b from-violet-50/60 to-zinc-50/40 dark:from-violet-950/20 dark:to-zinc-900/40" />
    </section>
  );
}
