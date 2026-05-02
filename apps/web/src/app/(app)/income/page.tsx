import { PageShell } from "@/components/app/page-shell";
import { IncomePanel } from "./income-panel";

import { WEB_ROUTES } from "shared";

export default function IncomePage() {
  return (
    <PageShell
      title="Revenus"
      description="Enregistrez tous les revenus de l'organisation (cotisations, dons, subventions, ventes) avec une mise en forme claire."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Revenus" },
      ]}
    >
      <IncomePanel />
    </PageShell>
  );
}
