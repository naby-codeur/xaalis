import type { FastifyInstance } from "fastify";

import * as metricsController from "../../controllers/metrics.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";
import { PERMISSIONS } from "shared";

export default async function metricsRoutes(app: FastifyInstance) {
  app.get(
    "/metrics/overview",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.REPORTS_READ),
      ],
    },
    metricsController.overview,
  );
  app.get(
    "/metrics/cashflow",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.REPORTS_READ),
      ],
    },
    metricsController.cashflow,
  );
  app.get(
    "/metrics/projects",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.REPORTS_READ),
      ],
    },
    metricsController.projects,
  );
  app.get(
    "/metrics/team",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.REPORTS_READ),
      ],
    },
    metricsController.team,
  );
}
