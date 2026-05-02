"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { DashboardTopbar } from "@/components/app/dashboard-topbar";
import { NavIcon, SidebarChevronLeft, SidebarChevronRight } from "@/components/app/nav-icon";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";

import type { MenuItem } from "shared";
import { WEB_ROUTES } from "shared";

const STORAGE_KEY = "xaalis_sidebar_collapsed";

type AppShellProps = {
  children: React.ReactNode;
  navItems: readonly MenuItem[];
  user: {
    email: string;
    name?: string | null;
    role: string;
    organizationLogoUrl?: string | null;
  };
};

export function AppShell({ children, navItems, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const asideWidth = collapsed ? "md:w-16" : "md:w-64";
  const mainOffset = collapsed ? "md:ml-16" : "md:ml-64";

  return (
    <div className="min-h-full">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-violet-200/40 bg-white/80 p-3 shadow-[6px_0_32px_-18px_rgba(124,58,237,0.2)] backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/85 dark:shadow-black/40 md:flex md:flex-col ${asideWidth}`}
      >
        <div className={collapsed ? "mb-4 flex flex-col items-center gap-2" : "mb-4 flex flex-col gap-2"}>
          <Link
            href={WEB_ROUTES.dashboard}
            title="Xaalis"
            className={
              collapsed
                ? "flex items-center justify-center rounded-xl p-1 text-sm font-semibold tracking-tight text-zinc-950 transition-shadow hover:shadow-md hover:shadow-violet-500/10 dark:text-zinc-50"
                : "flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold tracking-tight text-zinc-950 transition-shadow hover:shadow-md hover:shadow-violet-500/10 dark:text-zinc-50"
            }
          >
            <Image
              src="/logo_xaalis.png"
              alt="Logo Xaalis"
              width={28}
              height={28}
              className="shrink-0"
              style={{ width: "auto", height: "auto" }}
            />
            {!collapsed ? <span>Xaalis</span> : <span className="sr-only">Xaalis</span>}
          </Link>
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-200/80 bg-violet-50/50 text-violet-700 transition-all hover:border-violet-300 hover:bg-violet-100/80 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            {collapsed ? <SidebarChevronRight className="h-4 w-4" /> : <SidebarChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarNav items={navItems} collapsed={collapsed} />
        </div>
        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            href={WEB_ROUTES.settings}
            title="Paramètres"
            className={
              collapsed
                ? "mb-2 flex items-center justify-center rounded-xl p-2 text-violet-800 transition-colors hover:bg-violet-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                : "mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-violet-950 transition-colors hover:bg-violet-50/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
            }
          >
            <NavIcon name="settings" className="h-[1.125rem] w-[1.125rem]" />
            {!collapsed ? <span>Paramètres</span> : null}
          </Link>
          <div className={collapsed ? "flex justify-center" : ""}>
            <LogoutButton variant={collapsed ? "icon" : "default"} />
          </div>
        </div>
      </aside>

      <div className={`flex min-h-full flex-1 flex-col ${mainOffset}`}>
        <DashboardTopbar user={user} sidebarCollapsed={collapsed} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-12 pt-24">{children}</main>
      </div>
    </div>
  );
}
