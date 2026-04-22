"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Inscription
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Créez votre organisation et votre compte administrateur.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Nom de l’organisation
            </span>
            <input
              required
              type="text"
              value={organizationName}
              onChange={(ev) => setOrganizationName(ev.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
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
              Votre nom (optionnel)
            </span>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Mot de passe (min. 8 caractères)
            </span>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
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
            {loading ? "Création…" : "Créer le compte"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Déjà inscrit ?{" "}
          <Link
            href={WEB_ROUTES.login}
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Se connecter
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
