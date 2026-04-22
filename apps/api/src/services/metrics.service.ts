import type { MetricsResponse } from "shared";

import { env } from "../config/env";

function useMockMetrics(): boolean {
  if (env.METRICS_USE_MOCK === "1") return true;
  if (env.METRICS_USE_MOCK === "0") return false;
  return env.NODE_ENV === "development";
}

const MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function hashOrg(organizationId: string): number {
  let h = 0;
  for (let i = 0; i < organizationId.length; i++) {
    h = (h * 31 + organizationId.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Données d’illustration : courbe stable + légère variation selon l’organisation. */
export function buildMockOverview(organizationId: string): MetricsResponse {
  const seed = hashOrg(organizationId);
  const scale = 180_000 + (seed % 120_000);

  const series = MONTHS_FR.map((label, i) => {
    const wave = Math.sin((i / 11) * Math.PI * 2 + seed * 0.017) * 0.22;
    const drift = i * 0.035;
    const value = Math.round(scale * (0.5 + wave + drift));
    return { label, value };
  });

  const totalNetMovement = series.reduce((sum, p) => sum + p.value, 0);

  return {
    version: 1,
    meta: {
      organizationId,
      mock: true,
      unit: "XOF",
      period: "12 derniers mois (données fictives)",
      totalNetMovement,
      computedAt: new Date().toISOString(),
    },
    series,
  };
}

export async function computeOverview(
  organizationId: string,
): Promise<MetricsResponse> {
  if (useMockMetrics()) {
    return buildMockOverview(organizationId);
  }

  return {
    version: 1,
    meta: {
      organizationId,
      mock: false,
      computedAt: new Date().toISOString(),
    },
    series: [],
  };
}
