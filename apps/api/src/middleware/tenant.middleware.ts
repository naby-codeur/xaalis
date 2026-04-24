import type { FastifyReply, FastifyRequest } from "fastify";

export async function assertTenant(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (!request.user?.organizationId) {
    return reply.status(401).send({
      error: {
        code: "UNAUTHORIZED",
        message: "Organization context missing",
      },
    });
  }
}
