"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavIcon } from "@/components/app/nav-icon";

import type { MenuItem } from "shared";

const NAV_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  members: "Membres",
  contributions: "Cotisations",
  income: "Revenus",
  expenses: "Dépenses",
  projects: "Projets",
  reports: "Rapports",
  team: "Équipe",
  settings: "Paramètres",
};

export function SidebarNav({
  items,
  collapsed = false,
}: {
  items: readonly MenuItem[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const href = item.web!.path;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        const label = NAV_LABELS[item.key] ?? item.key;
        return (
          <Link
            key={item.key}
            href={href}
            title={collapsed ? label : undefined}
            className={`group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
            } ${
              active
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 dark:from-violet-500 dark:to-indigo-500 dark:shadow-violet-900/40"
                : "text-zinc-600 hover:bg-violet-50/90 hover:text-violet-950 dark:text-zinc-400 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-100"
            }`}
          >
            <NavIcon name={item.icon} className={active ? "text-current" : undefined} />
            {collapsed ? (
              <span className="sr-only">{label}</span>
            ) : (
              <span className="truncate">{label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
