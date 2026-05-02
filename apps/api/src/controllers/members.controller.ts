import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createOrganizationMemberSchema,
  updateOrganizationMemberSchema,
} from "shared";

import * as membersService from "../services/members.service";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const data = await membersService.listMembers(request.user!.organizationId);
  return reply.send({ data });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const payload = createOrganizationMemberSchema.parse(request.body ?? {});
  const data = await membersService.createMember({
    organizationId: request.user!.organizationId,
    createdBy: request.user!.id,
    payload,
  });
  return reply.status(201).send({ data });
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const payload = updateOrganizationMemberSchema.parse(request.body ?? {});
  const data = await membersService.updateMember({
    organizationId: request.user!.organizationId,
    memberId: id,
    payload,
  });
  return reply.send({ data });
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = await membersService.deleteMember(
    request.user!.organizationId,
    id,
  );
  return reply.send(result);
}
