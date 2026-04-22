"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
      <p className="font-medium">Impossible de charger les métriques.</p>
      <p className="mt-2 text-red-800/90 dark:text-red-200/90">
        {error.message.startsWith("metrics_overview_")
          ? "L’API n’a pas renvoyé de données valides. Vérifiez que le serveur tourne et que votre rôle autorise la lecture des rapports."
          : error.message}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-full border border-red-300 bg-white px-4 py-1.5 text-xs font-medium text-red-900 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
      >
        Réessayer
      </button>
    </div>
  );
}
