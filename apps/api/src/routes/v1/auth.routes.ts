import type { FastifyInstance } from "fastify";

import * as authController from "../../controllers/auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { PERMISSIONS } from "shared";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/dev-login", authController.devLogin);
  app.post("/auth/login", authController.login);
  app.post("/auth/register", authController.register);
  app.post("/auth/refresh", authController.refresh);
  app.post("/auth/logout", authController.logout);

  app.get(
    "/auth/me",
    { preHandler: [authenticate] },
    authController.me,
  );

  app.get(
    "/auth/organization/logo",
    { preHandler: [authenticate] },
    authController.getOrganizationLogo,
  );

  app.patch(
    "/auth/organization/logo",
    {
      preHandler: [
        authenticate,
        requirePermissionHook(PERMISSIONS.ORG_SETTINGS_MANAGE),
      ],
    },
    authController.updateOrganizationLogo,
  );
}
