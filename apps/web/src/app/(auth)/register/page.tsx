"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { xaAuthFrame, xaBtnPrimary, xaInput } from "@/lib/xaalis-ui";
import { WEB_ROUTES } from "shared";

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

export default function RegisterPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organizationName,
            email,
            password,
            ...(name.trim() ? { name: name.trim() } : {}),
          }),
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
    [organizationName, email, name, password, router],
  );

  return (
    <main className="mx-auto w-full max-w-md">
      <div className={xaAuthFrame}>
        <div className="rounded-2xl bg-white/95 p-8 shadow-inner dark:bg-zinc-950/95">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            Bienvenue
          </p>
          <h1 className="mt-2 bg-gradient-to-br from-violet-700 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-300 dark:to-teal-400">
            Inscription
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Créez votre organisation et votre compte administrateur en quelques minutes.
          </p>

          <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-violet-950 dark:text-zinc-300">Nom de l’organisation</span>
              <input
                required
                type="text"
                value={organizationName}
                onChange={(ev) => setOrganizationName(ev.target.value)}
                className={xaInput}
              />
            </label>
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
              <span className="font-medium text-violet-950 dark:text-zinc-300">Votre nom (optionnel)</span>
              <input
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                className={xaInput}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-violet-950 dark:text-zinc-300">
                Mot de passe (min. 8 caractères)
              </span>
              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
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
              {loading ? "Création…" : "Créer le compte"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Déjà inscrit ?{" "}
            <Link
              href={WEB_ROUTES.login}
              className="font-semibold text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
            >
              Se connecter
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
