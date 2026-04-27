import type { FastifyReply, FastifyRequest } from "fastify";

import * as metricsService from "../services/metrics.service";

/** v0.1.0: cashflow/projects/team reuse overview payload until dedicated queries exist. */

export async function overview(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}

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
