import type { MetricsResponse } from "shared";

export const fallbackOverviewMetrics: MetricsResponse = {
  version: 1,
  meta: {
    mock: true,
    unit: "XOF",
    period: "12 derniers mois (fallback mobile)",
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
