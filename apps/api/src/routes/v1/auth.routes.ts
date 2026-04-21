import type { FastifyInstance } from "fastify";

import * as authController from "../../controllers/auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", authController.login);
  app.post("/auth/register", authController.register);
  app.post("/auth/logout", authController.logout);

  app.get(
    "/auth/me",
    { preHandler: [authenticate] },
    authController.me,
  );
}
