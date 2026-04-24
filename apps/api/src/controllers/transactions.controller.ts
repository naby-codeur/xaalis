import type { FastifyReply, FastifyRequest } from "fastify";

import * as transactionsService from "../services/transactions.service";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const result = await transactionsService.listTransactions(
    request.user!.organizationId,
  );
  return reply.send({ data: result });
}
