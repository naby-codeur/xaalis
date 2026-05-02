import { OverviewChart } from "@/components/dashboard/overview-chart";
import { getCashflowMetrics } from "@/lib/metrics-server";

export async function DashboardCashflowSection() {
  const data = await getCashflowMetrics();
  return (
    <OverviewChart
      data={data}
      title="Trésorerie (cashflow)"
      lineName="Montant"
    />
  );
}
