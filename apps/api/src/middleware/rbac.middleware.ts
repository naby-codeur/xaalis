import type { FastifyReply, FastifyRequest } from "fastify";

import { requirePermission } from "auth";
import type { Permission } from "shared";

export function requirePermissionHook(permission: Permission) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.status(401).send({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }
    requirePermission(request.user.role, permission);
  };
}
