import type { FastifyInstance } from "fastify";

import authRoutes from "./v1/auth.routes";
import contributionsRoutes from "./v1/contributions.routes";
import membersRoutes from "./v1/members.routes";
import metricsRoutes from "./v1/metrics.routes";
import organizationUsersRoutes from "./v1/organization-users.routes";
import projectsRoutes from "./v1/projects.routes";

export default async function registerRoutes(app: FastifyInstance) {
  await app.register(
    async (v1) => {
      await v1.register(authRoutes);
      await v1.register(metricsRoutes);
      await v1.register(projectsRoutes);
      await v1.register(membersRoutes);
      await v1.register(contributionsRoutes);
      await v1.register(organizationUsersRoutes);
    },
    { prefix: "/v1" },
  );
}
