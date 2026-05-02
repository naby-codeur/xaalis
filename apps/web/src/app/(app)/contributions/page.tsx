import { PageShell } from "@/components/app/page-shell";
import { ContributionsPanel } from "./contributions-panel";

import { WEB_ROUTES } from "shared";

export default function ContributionsPage() {
  return (
    <PageShell
      title="Cotisations"
      description="Ajoutez et suivez les cotisations (membre, montant, mode de paiement, date, type, description) avec une vue claire par ligne."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Cotisations" },
      ]}
    >
      <ContributionsPanel />
    </PageShell>
  );
}
