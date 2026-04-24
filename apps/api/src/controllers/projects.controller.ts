import type { FastifyReply, FastifyRequest } from "fastify";

import * as projectsService from "../services/projects.service";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const result = await projectsService.listProjects(
    request.user!.organizationId,
  );
  return reply.send({ data: result });
}
