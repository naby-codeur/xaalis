"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { WEB_ROUTES } from "shared";

const showDevEntry =
  process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "1" ||
  process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS?.toLowerCase() === "true";

function apiErrorMessage(payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error
  ) {
    return String((payload.error as { message: unknown }).message);
  }
  return "Une erreur est survenue.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(apiErrorMessage(data));
          return;
        }
        router.push(WEB_ROUTES.dashboard);
        router.refresh();
      } finally {
        setLoading(false);
      }
    },
    [email, password, router],
  );

  const onDevLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "dev" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(apiErrorMessage(data));
        return;
      }
      router.push(WEB_ROUTES.dashboard);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Accédez à votre espace Xaliss Manager.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              E-mail
            </span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Mot de passe
            </span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {showDevEntry ? (
          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Mode développement : session de démo sans compte en base.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={onDevLogin}
              className="mt-3 w-full rounded-full border border-dashed border-zinc-400 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Entrer en mode dev
            </button>
          </div>
        ) : null}

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Pas encore de compte ?{" "}
          <Link
            href={WEB_ROUTES.register}
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Créer un compte
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link
            href={WEB_ROUTES.home}
            className="text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline dark:hover:text-zinc-300"
          >
            Retour à l’accueil
          </Link>
        </p>
      </div>
    </main>
  );
}
