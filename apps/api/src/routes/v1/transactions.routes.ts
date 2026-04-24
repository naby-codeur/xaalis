import type { FastifyInstance } from "fastify";

import * as transactionsController from "../../controllers/transactions.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermissionHook } from "../../middleware/rbac.middleware";
import { assertTenant } from "../../middleware/tenant.middleware";
import { PERMISSIONS } from "shared";

export default async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    "/transactions",
    {
      preHandler: [
        authenticate,
        assertTenant,
        requirePermissionHook(PERMISSIONS.TRANSACTION_READ),
      ],
    },
    transactionsController.list,
  );
}
