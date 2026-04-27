"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { MenuItem } from "shared";

const NAV_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  transactions: "Transactions",
  projects: "Projets",
  reports: "Rapports",
  team: "Équipe",
  settings: "Paramètres",
};

export function SidebarNav({ items }: { items: readonly MenuItem[] }) {
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
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
