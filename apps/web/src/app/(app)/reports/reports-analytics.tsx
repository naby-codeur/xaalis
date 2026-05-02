import { OverviewChart } from "@/components/dashboard/overview-chart";
import {
  getCashflowMetrics,
  getOverviewMetrics,
  getProjectsMetrics,
  getTeamMetrics,
} from "@/lib/metrics-server";

export async function ReportsAnalytics() {
  const [overview, cashflow, projects, team] = await Promise.all([
    getOverviewMetrics(),
    getCashflowMetrics(),
    getProjectsMetrics(),
    getTeamMetrics(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <OverviewChart
        data={overview}
        title="Synthèse (overview)"
        lineName="Valeur"
      />
      <OverviewChart
        data={cashflow}
        title="Trésorerie (cashflow)"
        lineName="Montant"
      />
      <OverviewChart
        data={projects}
        title="Projets (agrégat)"
        lineName="Montant"
      />
      <OverviewChart data={team} title="Équipe (indicateurs)" lineName="Effectif" />
    </div>
  );
}
