import { OverviewChart } from "@/components/dashboard/overview-chart";
import { getOverviewMetrics } from "@/lib/metrics-server";

export async function DashboardOverviewSection() {
  const data = await getOverviewMetrics();
  return <OverviewChart data={data} />;
}
