import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { AuthorizationError } from "auth";

export default fp(async (app: FastifyInstance) => {
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "unhandled error");

    if (error instanceof AuthorizationError) {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: error.message },
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: { issues: error.validation },
        },
      });
    }

    const status = error.statusCode ?? 500;
    return reply.status(status).send({
      error: {
        code: status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
        message: status >= 500 ? "Internal server error" : error.message,
      },
    });
  });
});
