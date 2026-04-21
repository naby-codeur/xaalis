import type { FastifyReply, FastifyRequest } from "fastify";

import * as metricsService from "../services/metrics.service";

export async function overview(request: FastifyRequest, reply: FastifyReply) {
  const result = await metricsService.computeOverview(
    request.user!.organizationId,
  );
  return reply.send(result);
}
