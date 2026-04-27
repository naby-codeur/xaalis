import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { AuthorizationError } from "auth";

export default fp(async (app: FastifyInstance) => {
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "unhandled error");
    const requestId = request.id;
    reply.header("x-request-id", requestId);
    const err = error as {
      statusCode?: number;
      message?: string;
      validation?: unknown;
    };

    if (error instanceof AuthorizationError) {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: error.message, requestId },
      });
    }

    if (err.validation) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          requestId,
          details: { issues: err.validation },
        },
      });
    }

    const status = err.statusCode ?? 500;
    return reply.status(status).send({
      error: {
        code: status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
        message: status >= 500 ? "Internal server error" : (err.message ?? "Request error"),
        requestId,
      },
    });
  });
});
