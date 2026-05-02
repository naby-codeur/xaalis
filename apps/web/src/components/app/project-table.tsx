import type { Project } from "shared";

export function ProjectTable({ rows }: { rows: Project[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        Aucun projet. Créez des projets via l&apos;API ou le flux d&apos;onboarding pour
        les voir ici.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={p.id}
              className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
            >
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                {p.name}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                {p.description?.trim() ? p.description : "—"}
              </td>
              <td className="px-4 py-3 text-zinc-500 dark:text-zinc-500">
                {new Date(p.createdAt).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
