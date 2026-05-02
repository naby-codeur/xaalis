import { PageShell } from "@/components/app/page-shell";
import { ReportsAdvancedPanel } from "./reports-advanced-panel";

import { WEB_ROUTES } from "shared";

export default function ReportsPage() {
  return (
    <PageShell
      title="Rapports"
      description="Cockpit de reporting avance avec filtres dynamiques, graphiques multi-vues, comparatifs et export detaille."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Rapports" },
      ]}
    >
      <ReportsAdvancedPanel />
    </PageShell>
  );
}
