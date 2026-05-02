import Link from "next/link";
import { Suspense } from "react";

import { ModuleQuickLinks } from "@/components/dashboard/module-quick-links";
import { OverviewSkeleton } from "@/components/dashboard/overview-skeleton";
import { PageShell } from "@/components/app/page-shell";
import { getSessionUser } from "@/lib/session";

import { DashboardCashflowSection } from "./cashflow-section";
import { DashboardOverviewSection } from "./overview-section";

import { WEB_ROUTES } from "shared";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <PageShell
      title="Tableau de bord"
      description={`Bonjour ${user.name ?? user.email} — voici votre synthèse : indicateurs, trésorerie et raccourcis vers tout ce qui compte pour votre organisation.`}
      breadcrumbs={[{ label: "Tableau de bord" }]}
    >
      <ModuleQuickLinks />

      <div className="grid gap-8 lg:grid-cols-1">
        <Suspense fallback={<OverviewSkeleton />}>
          <DashboardOverviewSection />
        </Suspense>
        <Suspense fallback={<OverviewSkeleton />}>
          <DashboardCashflowSection />
        </Suspense>
      </div>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href={WEB_ROUTES.home}
          className="font-medium text-violet-700 underline-offset-4 transition-colors hover:text-violet-900 hover:underline dark:text-violet-300 dark:hover:text-violet-200"
        >
          ← Site public
        </Link>
      </p>
    </PageShell>
  );
}
