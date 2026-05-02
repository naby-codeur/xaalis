import { PageShell } from "@/components/app/page-shell";
import { MembersPanel } from "./members-panel";

import { WEB_ROUTES } from "shared";

export default function MembersPage() {
  return (
    <PageShell
      title="Membres"
      description="Gérez les membres de l'organisation (nom, téléphone, adresse, sexe), puis cliquez sur un membre pour voir son historique de cotisations."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Membres" },
      ]}
    >
      <MembersPanel />
    </PageShell>
  );
}
