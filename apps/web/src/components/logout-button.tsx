"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { WEB_ROUTES } from "shared";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onLogout = useCallback(async () => {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(WEB_ROUTES.login);
      router.refresh();
    } finally {
      setPending(false);
    }
  }, [router]);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onLogout}
      className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {pending ? "Déconnexion…" : "Déconnexion"}
    </button>
  );
}
