import Link from "next/link";

import { xaBtnPrimary, xaBtnSecondary } from "@/lib/xaalis-ui";

import { WEB_ROUTES } from "shared";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.2),transparent),radial-gradient(circle_at_80%_60%,rgba(20,184,166,0.12),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_10%,rgba(139,92,246,0.25),transparent)]"
      />
      <div className="relative flex max-w-xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 shadow-sm backdrop-blur-sm dark:border-violet-800/60 dark:bg-zinc-900/60 dark:text-violet-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden />
          v0.1.0
        </span>
        <h1 className="bg-gradient-to-br from-violet-700 via-fuchsia-600 to-teal-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl dark:from-violet-200 dark:via-fuchsia-200 dark:to-teal-300">
          Xaalis
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          La plateforme pensée pour les ONG, associations et petites structures : trésorerie,
          projets et équipe réunis dans une interface claire et agréable au quotidien.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={WEB_ROUTES.login} className={`${xaBtnPrimary} flex-1 sm:flex-none sm:min-w-[10rem]`}>
            Se connecter
          </Link>
          <Link
            href={WEB_ROUTES.register}
            className={`${xaBtnSecondary} flex-1 border-violet-200 sm:flex-none sm:min-w-[10rem]`}
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
