import Link from "next/link";
import { Suspense } from "react";

import { OverviewSkeleton } from "@/components/dashboard/overview-skeleton";
import { getSessionUser } from "@/lib/session";

import { DashboardOverviewSection } from "./overview-section";

import { WEB_ROUTES } from "shared";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Tableau de bord
        </h1>
        <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
          Bienvenue,{" "}
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {user.name ?? user.email}
          </span>
          . Les indicateurs ci-dessous proviennent de l’API (
          <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">
            GET /v1/metrics/overview
          </code>
          ) ; en développement, des{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">
            séries fictives
          </strong>{" "}
          illustrent le contrat partagé web / mobile.
        </p>
      </div>

      <Suspense fallback={<OverviewSkeleton />}>
        <DashboardOverviewSection />
      </Suspense>

      <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <li>
          <Link
            href={WEB_ROUTES.home}
            className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            ← Retour au site public
          </Link>
        </li>
      </ul>
    </div>
  );
}