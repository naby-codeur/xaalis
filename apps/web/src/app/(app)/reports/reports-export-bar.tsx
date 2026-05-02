"use client";

export function ReportsExportBar() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Les exports lourds (PDF, Excel) doivent passer par l&apos;API avec la permission{" "}
        <code className="rounded bg-white px-1 text-xs dark:bg-zinc-950">reports.export</code>{" "}
        (cahier des charges §4.3). Les graphiques ci-dessous utilisent les mêmes endpoints
        que le mobile.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700"
        >
          Export PDF (à brancher)
        </button>
        <button
          type="button"
          disabled
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700"
        >
          Export Excel (à brancher)
        </button>
      </div>
    </div>
  );
}
