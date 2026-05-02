import Link from "next/link";
import type { ReactNode } from "react";

export type BreadcrumbItem = { label: string; href?: string };

export function PageShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-10">
      <nav aria-label="Fil d'Ariane" className="text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <span aria-hidden="true" className="text-violet-300 dark:text-zinc-600">
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-full bg-white/60 px-2.5 py-0.5 text-violet-800 underline-offset-4 backdrop-blur-sm transition-colors hover:bg-violet-100/80 hover:text-violet-950 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="rounded-full bg-gradient-to-r from-violet-600/10 to-teal-600/10 px-2.5 py-0.5 font-medium text-violet-950 dark:from-violet-500/15 dark:to-teal-500/10 dark:text-zinc-100">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-4 -top-6 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/15"
        />
        <div className="relative space-y-3">
          <h1 className="bg-gradient-to-br from-violet-700 via-violet-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-300 dark:via-violet-200 dark:to-teal-300">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="relative flex shrink-0 flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>

      {children}
    </div>
  );
}
