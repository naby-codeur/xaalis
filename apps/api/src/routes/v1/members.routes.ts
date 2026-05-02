import type { FastifyInstance } from "fastify";
import { PERMISSIONS } from "shared";

import * as membersController from "../../controllers/members.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";

export default async function membersRoutes(app: FastifyInstance) {
  app.get(
    "/members",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.MEMBERS_READ),
      ],
    },
    membersController.list,
  );

  app.post(
    "/members",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.MEMBERS_MANAGE),
      ],
    },
    membersController.create,
  );

  app.patch(
    "/members/:id",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.MEMBERS_MANAGE),
      ],
    },
    membersController.update,
  );

  app.delete(
    "/members/:id",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.MEMBERS_MANAGE),
      ],
    },
    membersController.remove,
  );
}
