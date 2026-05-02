import { PageShell } from "@/components/app/page-shell";
import { ExpensesPanel } from "./expenses-panel";

import { WEB_ROUTES } from "shared";

export default function ExpensesPage() {
  return (
    <PageShell
      title="Dépenses"
      description="Suivez les dépenses avec toutes les modalités utiles (date, type, bénéficiaire, mode de paiement, statut, référence)."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Dépenses" },
      ]}
    >
      <ExpensesPanel />
    </PageShell>
  );
}
