import type { FastifyInstance } from "fastify";
import { PERMISSIONS } from "shared";

import * as contributionsController from "../../controllers/contributions.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";

export default async function contributionsRoutes(app: FastifyInstance) {
  app.get(
    "/contributions",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.CONTRIBUTIONS_READ),
      ],
    },
    contributionsController.list,
  );

  app.post(
    "/contributions",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.CONTRIBUTIONS_MANAGE),
      ],
    },
    contributionsController.create,
  );

  app.patch(
    "/contributions/:id",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.CONTRIBUTIONS_MANAGE),
      ],
    },
    contributionsController.update,
  );

  app.delete(
    "/contributions/:id",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.CONTRIBUTIONS_MANAGE),
      ],
    },
    contributionsController.remove,
  );
}
