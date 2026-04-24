import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/session";

import { MENU_ITEMS, WEB_ROUTES } from "shared";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const navItems = MENU_ITEMS.filter((item) => item.web?.path);

  return (
    <div className="flex min-h-full flex-1 bg-zinc-50 dark:bg-black">
      <aside className="hidden w-64 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:block">
        <Link
          href={WEB_ROUTES.dashboard}
          className="mb-6 block text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Xaliss Manager
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.web!.path}
              className="rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {item.key}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-full flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
              {user.name ? ` · ${user.name}` : ""}
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {user.role}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
