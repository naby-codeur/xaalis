import type { FastifyInstance } from "fastify";

import authRoutes from "./v1/auth.routes";
import metricsRoutes from "./v1/metrics.routes";
import transactionsRoutes from "./v1/transactions.routes";

export default async function registerRoutes(app: FastifyInstance) {
  await app.register(
    async (v1) => {
      await v1.register(authRoutes);
      await v1.register(metricsRoutes);
      await v1.register(transactionsRoutes);
    },
    { prefix: "/v1" },
  );
}
