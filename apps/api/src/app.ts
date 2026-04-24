import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import { env } from "./config/env";
import { loggerOptions } from "./utils/logger";
import prismaPlugin from "./plugins/prisma.plugin";
import errorsPlugin from "./plugins/errors.plugin";
import registerRoutes from "./routes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerOptions });

  await app.register(cors, {
    origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : true,
    credentials: true,
  });

  await app.register(prismaPlugin);
  await app.register(errorsPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  await registerRoutes(app);

  return app;
}
