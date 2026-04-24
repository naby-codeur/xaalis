import type { FastifyInstance } from "fastify";

import * as authController from "../../controllers/auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/dev-login", authController.devLogin);
  app.post("/auth/login", authController.login);
  app.post("/auth/register", authController.register);
<<<<<<< HEAD
  app.post("/auth/refresh", authController.refresh);
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
  app.post("/auth/logout", authController.logout);

  app.get(
    "/auth/me",
    { preHandler: [authenticate] },
    authController.me,
  );
}
