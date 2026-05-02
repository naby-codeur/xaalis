"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { WEB_ROUTES } from "shared";

type LogoutButtonProps = {
  variant?: "default" | "icon";
};

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
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

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={onLogout}
        title={pending ? "Déconnexion…" : "Déconnexion"}
        aria-label={pending ? "Déconnexion en cours" : "Déconnexion"}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200/90 bg-white/80 text-violet-800 transition-all hover:border-violet-300 hover:bg-violet-50 hover:shadow-md disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onLogout}
      className="rounded-full border border-violet-200/90 bg-white/70 px-4 py-1.5 text-sm font-medium text-violet-950 shadow-sm transition-all hover:border-violet-300 hover:bg-violet-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
    >
      {pending ? "Déconnexion…" : "Déconnexion"}
    </button>
  );
}
