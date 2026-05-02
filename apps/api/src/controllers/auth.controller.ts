import type { FastifyReply, FastifyRequest } from "fastify";

import {
  loginSchema,
  refreshSchema,
  registerSchema,
  updateOrganizationLogoSchema,
} from "shared";

import * as authService from "../services/auth.service";

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const input = loginSchema.parse(request.body);
  const result = await authService.login(input);
  return reply.send(result);
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const input = registerSchema.parse(request.body);
  const result = await authService.register(input);
  return reply.status(201).send(result);
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const jwtUser = request.user!;
  const profile = await authService.resolveAuthenticatedUser({
    id: jwtUser.id,
    organizationId: jwtUser.organizationId,
    role: jwtUser.role,
  });
  return reply.send(profile);
}

export async function devLogin(request: FastifyRequest, reply: FastifyReply) {
  const result = authService.issueDevBypassSession();
  return reply.send(result);
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const input = refreshSchema.parse(request.body ?? {});
  const result = await authService.refresh(input.refreshToken);
  return reply.send(result);
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ ok: true });
}

export async function getOrganizationLogo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const jwtUser = request.user!;
  const result = await authService.getOrganizationLogo(jwtUser.organizationId);
  return reply.send(result);
}

export async function updateOrganizationLogo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const jwtUser = request.user!;
  const body = updateOrganizationLogoSchema.parse(request.body ?? {});
  const result = await authService.updateOrganizationLogo({
    organizationId: jwtUser.organizationId,
    logoUrl: body.logoUrl,
  });
  return reply.send(result);
}
