import Link from "next/link";

import { WEB_ROUTES } from "shared";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex max-w-xl flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          v0.1.0
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          Xaliss Manager
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Plateforme de gestion financière pour ONG, associations, PME et
          coopératives. Pilotez vos flux, projets et équipes depuis une seule
          source de vérité.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={WEB_ROUTES.login}
            className="flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Se connecter
          </Link>
          <Link
            href={WEB_ROUTES.register}
            className="flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
