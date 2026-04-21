import type { MetricsResponse } from "shared";

export async function computeOverview(
  organizationId: string,
): Promise<MetricsResponse> {
  // TODO: brancher les agrégations Prisma (pipeline MongoDB).
  return {
    version: 1,
    meta: { organizationId, computedAt: new Date().toISOString() },
    series: [],
  };
}
