import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
  generateSessionId,
  computeExpiry,
} from "auth";
import { prisma } from "db";
import type { LoginInput, RegisterInput, Role } from "shared";

import { env } from "../config/env";

const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessTtl: env.JWT_ACCESS_TTL,
  refreshTtl: env.JWT_REFRESH_TTL,
};

function ttlToSeconds(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) return 60 * 60 * 24 * 30;
  const value = Number(match[1]);
  const unit = match[2];
  const factors: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (factors[unit] ?? 1);
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name ?? null,
      memberships: {
        create: {
          role: "ADMIN",
          organization: {
            create: {
              name: input.organizationName,
              slug: slugify(input.organizationName),
            },
          },
        },
      },
    },
    include: { memberships: { include: { organization: true } } },
  });

  const membership = user.memberships[0];
  if (!membership) {
    throw new Error("Failed to create membership");
  }

  return issueTokens(user.id, membership.organizationId, membership.role as Role, {
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  });
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { memberships: true },
  });
  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  const membership = user.memberships[0];
  if (!membership) {
    throw Object.assign(new Error("No organization"), { statusCode: 403 });
  }

  return issueTokens(user.id, membership.organizationId, membership.role as Role, {
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  });
}

export async function logout(userId: string, sessionId: string) {
  await prisma.session.updateMany({
    where: { id: sessionId, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function issueTokens(
  userId: string,
  organizationId: string,
  role: Role,
  profile: { email: string; name: string | null; createdAt: string },
) {
  const sessionId = generateSessionId();
  const accessToken = signAccessToken(
    { sub: userId, organizationId, role },
    jwtConfig,
  );
  const refreshToken = signRefreshToken({ sub: userId, sid: sessionId }, jwtConfig);
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = computeExpiry(ttlToSeconds(env.JWT_REFRESH_TTL));

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId,
      email: profile.email,
      name: profile.name,
      createdAt: profile.createdAt,
      organizationId,
      role,
    },
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
