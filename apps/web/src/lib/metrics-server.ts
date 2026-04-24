import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { metricsResponseSchema, type MetricsResponse } from "shared";

import { getApiBaseUrl } from "./server-api";

export async function getOverviewMetrics(): Promise<MetricsResponse> {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${getApiBaseUrl()}/v1/metrics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    throw new Error(`metrics_overview_${res.status}`);
  }

  const raw: unknown = await res.json();
  return metricsResponseSchema.parse(raw);
}
