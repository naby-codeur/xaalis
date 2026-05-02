import type { FastifyInstance } from "fastify";
import { PERMISSIONS } from "shared";

import * as organizationUsersController from "../../controllers/organization-users.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";

export default async function organizationUsersRoutes(app: FastifyInstance) {
  app.get(
    "/organization/users",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.USERS_READ),
      ],
    },
    organizationUsersController.list,
  );
}
