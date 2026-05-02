import { PageShell } from "@/components/app/page-shell";
import { ProjectsPanel } from "./projects-panel";

import { WEB_ROUTES } from "shared";

export default function ProjectsPage() {

  return (
    <PageShell
      title="Projets"
      description="Créez vos projets, définissez les budgets, alimentez-les depuis d'autres soldes et visualisez les cotisations liées."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Projets" },
      ]}
    >
      <ProjectsPanel />
    </PageShell>
  );
}
