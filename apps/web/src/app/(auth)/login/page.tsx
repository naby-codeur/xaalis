"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { xaAuthFrame, xaBtnPrimary, xaBtnSecondary, xaInput } from "@/lib/xaalis-ui";
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
      <div className={xaAuthFrame}>
        <div className="rounded-2xl bg-white/95 p-8 shadow-inner dark:bg-zinc-950/95">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            Xaalis
          </p>
          <h1 className="mt-2 bg-gradient-to-br from-violet-700 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-300 dark:to-teal-400">
            Connexion
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Retrouvez vos tableaux, membres et flux en un clin d’œil.
          </p>

          <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-violet-950 dark:text-zinc-300">E-mail</span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className={xaInput}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-violet-950 dark:text-zinc-300">Mot de passe</span>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className={xaInput}
              />
            </label>

            {error ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className={`${xaBtnPrimary} mt-1 w-full`}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          {showDevEntry ? (
            <div className="mt-6 border-t border-violet-100 pt-6 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Mode développement : session de démo sans compte en base.
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={onDevLogin}
                className={`${xaBtnSecondary} mt-3 w-full border-dashed`}
              >
                Entrer en mode dev
              </button>
            </div>
          ) : null}

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Pas encore de compte ?{" "}
            <Link
              href={WEB_ROUTES.register}
              className="font-semibold text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
            >
              Créer un compte
            </Link>
          </p>
          <p className="mt-4 text-center text-sm">
            <Link
              href={WEB_ROUTES.home}
              className="text-zinc-500 underline-offset-4 transition-colors hover:text-violet-700 hover:underline dark:hover:text-violet-300"
            >
              Retour à l’accueil
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
