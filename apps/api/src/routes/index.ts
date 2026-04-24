import type { FastifyInstance } from "fastify";

import authRoutes from "./v1/auth.routes";
import metricsRoutes from "./v1/metrics.routes";
<<<<<<< HEAD
import projectsRoutes from "./v1/projects.routes";
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
import transactionsRoutes from "./v1/transactions.routes";

export default async function registerRoutes(app: FastifyInstance) {
  await app.register(
    async (v1) => {
      await v1.register(authRoutes);
      await v1.register(metricsRoutes);
<<<<<<< HEAD
      await v1.register(projectsRoutes);
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
      await v1.register(transactionsRoutes);
    },
    { prefix: "/v1" },
  );
}
