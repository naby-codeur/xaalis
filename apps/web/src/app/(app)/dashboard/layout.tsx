<<<<<<< HEAD
=======
import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/session";

import { WEB_ROUTES } from "shared";

>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  return children;
=======
  const user = await getSessionUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <Link
              href={WEB_ROUTES.dashboard}
              className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              Xaliss Manager
            </Link>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
              {user.name ? ` · ${user.name}` : ""}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {user.role}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</div>
    </div>
  );
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
}
