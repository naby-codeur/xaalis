import type { FastifyReply, FastifyRequest } from "fastify";

import * as organizationUsersService from "../services/organization-users.service";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const data = await organizationUsersService.listOrganizationUsers(
    request.user!.organizationId,
  );
  return reply.send({ data });
}
