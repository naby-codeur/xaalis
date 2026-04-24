import type { FastifyReply, FastifyRequest } from "fastify";

import * as metricsService from "../services/metrics.service";

export async function overview(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}
<<<<<<< HEAD

export async function cashflow(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}

export async function projects(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}

export async function team(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
