import { metricsResponseSchema, type MetricsResponse } from "shared";

import { isWebDevAuthBypassEnabled } from "./dev-auth-bypass";
import { getApiBaseUrl } from "./server-api";
import {
  refreshDevBypassAccessToken,
  resolveServerAccessToken,
} from "./server-access-token";

const FALLBACK_OVERVIEW_METRICS: MetricsResponse = {
  version: 1,
  meta: {
    mock: true,
    unit: "XOF",
    period: "12 derniers mois (fallback web)",
  },
  series: [
    { label: "Jan", value: 180000 },
    { label: "Fev", value: 220000 },
    { label: "Mar", value: 195000 },
    { label: "Avr", value: 275000 },
    { label: "Mai", value: 260000 },
    { label: "Juin", value: 300000 },
  ],
};

export async function getOverviewMetrics(): Promise<MetricsResponse> {
  let token = await resolveServerAccessToken();
  if (!token) {
    if (isWebDevAuthBypassEnabled()) {
      const refreshed = await refreshDevBypassAccessToken();
      if (refreshed) token = refreshed;
    }
  }

  if (!token) {
    return FALLBACK_OVERVIEW_METRICS;
  }

  const url = `${getApiBaseUrl()}/v1/metrics/overview`;
  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401 && isWebDevAuthBypassEnabled()) {
    const t2 = await refreshDevBypassAccessToken();
    if (t2) {
      token = t2;
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    }
  }

  if (res.status === 401) return FALLBACK_OVERVIEW_METRICS;

  if (!res.ok) {
    return FALLBACK_OVERVIEW_METRICS;
  }

  try {
    const raw: unknown = await res.json();
    return metricsResponseSchema.parse(raw);
  } catch {
    return FALLBACK_OVERVIEW_METRICS;
  }
}
