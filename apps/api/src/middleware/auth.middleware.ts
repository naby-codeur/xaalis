import type { FastifyReply, FastifyRequest } from "fastify";

import { verifyAccessToken, type AccessTokenPayload } from "auth";
import type { Role } from "shared";

import { env } from "../config/env";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      organizationId: string;
      role: Role;
    };
  }
}

const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessTtl: env.JWT_ACCESS_TTL,
  refreshTtl: env.JWT_REFRESH_TTL,
};

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const header = request.headers.authorization;
  const token =
    header?.startsWith("Bearer ") ? header.slice(7) : extractCookie(request);

  if (!token) {
    return reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Missing credentials" },
    });
  }

  try {
    const payload = verifyAccessToken(token, jwtConfig) as AccessTokenPayload;
    request.user = {
      id: payload.sub,
      organizationId: payload.organizationId,
      role: payload.role as Role,
    };
  } catch {
    return reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}

function extractCookie(request: FastifyRequest): string | undefined {
  const raw = request.headers.cookie;
  if (!raw) return undefined;
  const match = raw.match(/(?:^|;\s*)access_token=([^;]+)/);
  return match?.[1];
}
