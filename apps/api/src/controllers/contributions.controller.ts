import type { FastifyReply, FastifyRequest } from "fastify";
import { createContributionSchema, updateContributionSchema } from "shared";

import * as contributionsService from "../services/contributions.service";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const data = await contributionsService.listContributions(
    request.user!.organizationId,
  );
  return reply.send({ data });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const payload = createContributionSchema.parse(request.body ?? {});
  const data = await contributionsService.createContribution({
    organizationId: request.user!.organizationId,
    createdBy: request.user!.id,
    payload,
  });
  return reply.status(201).send({ data });
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const payload = updateContributionSchema.parse(request.body ?? {});
  const data = await contributionsService.updateContribution({
    organizationId: request.user!.organizationId,
    contributionId: id,
    payload,
  });
  return reply.send({ data });
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = await contributionsService.deleteContribution(
    request.user!.organizationId,
    id,
  );
  return reply.send(result);
}
