import Link from "next/link";

import { xaGlassPanel } from "@/lib/xaalis-ui";

import { WEB_ROUTES } from "shared";

const LINKS = [
  {
    href: WEB_ROUTES.projects,
    title: "Projets",
    desc: "Budgets et affectations",
    accent: "from-fuchsia-500 to-violet-500",
  },
  {
    href: WEB_ROUTES.members,
    title: "Membres",
    desc: "Annuaire de l’organisation",
    accent: "from-teal-500 to-emerald-500",
  },
  {
    href: WEB_ROUTES.contributions,
    title: "Cotisations",
    desc: "Encaissements et échéances",
    accent: "from-amber-500 to-orange-500",
  },
  {
    href: WEB_ROUTES.income,
    title: "Revenus",
    desc: "Entrées d’argent",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    href: WEB_ROUTES.expenses,
    title: "Dépenses",
    desc: "Sorties d’argent",
    accent: "from-rose-500 to-pink-600",
  },
  {
    href: WEB_ROUTES.reports,
    title: "Rapports",
    desc: "Synthèses et exports",
    accent: "from-sky-500 to-blue-600",
  },
  {
    href: WEB_ROUTES.team,
    title: "Équipe & rôles",
    desc: "RBAC et accès",
    accent: "from-indigo-500 to-violet-600",
  },
] as const;

export function ModuleQuickLinks() {
  return (
    <section className={`${xaGlassPanel} relative overflow-hidden`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-violet-400/30 to-teal-300/20 blur-3xl dark:from-violet-600/20 dark:to-teal-500/10"
      />
      <div className="relative">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Accès rapides
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Un clic pour rejoindre chaque module — gardez le rythme sans vous perdre dans les menus.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative block overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/90 hover:shadow-lg hover:shadow-violet-500/10 dark:border-zinc-800/80 dark:from-zinc-900/90 dark:to-zinc-950/80 dark:hover:border-violet-800/50 dark:hover:shadow-violet-950/20"
              >
                <span
                  className={`mb-3 block h-1 w-10 rounded-full bg-gradient-to-r ${item.accent} opacity-90 transition-all group-hover:w-14`}
                />
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</span>
                <span className="mt-1 block text-xs leading-snug text-zinc-600 dark:text-zinc-400">
                  {item.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
