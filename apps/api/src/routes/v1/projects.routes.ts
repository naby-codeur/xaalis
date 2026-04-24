import type { FastifyInstance } from "fastify";

import * as projectsController from "../../controllers/projects.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";
import { PERMISSIONS } from "shared";

export default async function projectsRoutes(app: FastifyInstance) {
  app.get(
    "/projects",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.PROJECT_READ),
      ],
    },
    projectsController.list,
  );
}
