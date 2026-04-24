import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
<<<<<<< HEAD
  verifyRefreshToken,
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
  hashRefreshToken,
  generateSessionId,
  computeExpiry,
} from "auth";
import { prisma } from "db";
import {
  ROLES,
  type AuthenticatedUser,
  type LoginInput,
  type RegisterInput,
  type Role,
} from "shared";

import { env } from "../config/env";

/** Identité synthétique quand `DEV_AUTH_BYPASS` est actif (aucune ligne en base). */
export const DEV_BYPASS_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEV_BYPASS_ORG_ID = "00000000-0000-4000-8000-000000000002";

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
<<<<<<< HEAD
  const unit = match[2] as "s" | "m" | "h" | "d";
=======
  const unit = match[2];
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
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

<<<<<<< HEAD
export async function refresh(rawRefreshToken?: string) {
  const refreshToken = rawRefreshToken?.trim();
  if (!refreshToken) {
    throw Object.assign(new Error("Missing refresh token"), { statusCode: 401 });
  }

  let payload: { sub: string; sid: string };
  try {
    payload = verifyRefreshToken(refreshToken, jwtConfig);
  } catch {
    throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { id: payload.sid },
  });

  if (!session || session.userId !== payload.sub || session.revokedAt) {
    throw Object.assign(new Error("Invalid session"), { statusCode: 401 });
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    throw Object.assign(new Error("Session expired"), { statusCode: 401 });
  }

  const incomingHash = hashRefreshToken(refreshToken);
  if (incomingHash !== session.refreshTokenHash) {
    throw Object.assign(new Error("Invalid refresh token"), { statusCode: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { memberships: true },
  });
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const membership = user.memberships[0];
  if (!membership) {
    throw Object.assign(new Error("No organization"), { statusCode: 403 });
  }

  const accessToken = signAccessToken(
    { sub: user.id, organizationId: membership.organizationId, role: membership.role as Role },
    jwtConfig,
  );
  const rotatedRefreshToken = signRefreshToken({ sub: user.id, sid: session.id }, jwtConfig);
  const refreshTokenHash = hashRefreshToken(rotatedRefreshToken);
  const expiresAt = computeExpiry(ttlToSeconds(env.JWT_REFRESH_TTL));

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash, expiresAt },
  });

  return {
    accessToken,
    refreshToken: rotatedRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      organizationId: membership.organizationId,
      role: membership.role as Role,
    },
  };
}

=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
export async function logout(userId: string, sessionId: string) {
  await prisma.session.updateMany({
    where: { id: sessionId, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export function issueDevBypassSession() {
  if (env.NODE_ENV !== "development" || !env.DEV_AUTH_BYPASS) {
    throw Object.assign(new Error("Dev login is disabled"), { statusCode: 403 });
  }

  const accessToken = signAccessToken(
    {
      sub: DEV_BYPASS_USER_ID,
      organizationId: DEV_BYPASS_ORG_ID,
      role: ROLES.ADMIN,
    },
    jwtConfig,
  );

  const user: AuthenticatedUser = {
    id: DEV_BYPASS_USER_ID,
    email: "dev@local.test",
    name: "Utilisateur dev",
    createdAt: new Date(0).toISOString(),
    organizationId: DEV_BYPASS_ORG_ID,
    role: ROLES.ADMIN,
  };

  return {
    accessToken,
    refreshToken: "",
    user,
  };
}

export async function resolveAuthenticatedUser(jwtUser: {
  id: string;
  organizationId: string;
  role: Role;
}): Promise<AuthenticatedUser> {
  if (
    env.NODE_ENV === "development" &&
    env.DEV_AUTH_BYPASS &&
    jwtUser.id === DEV_BYPASS_USER_ID
  ) {
    return {
      id: DEV_BYPASS_USER_ID,
      email: "dev@local.test",
      name: "Utilisateur dev",
      createdAt: new Date(0).toISOString(),
      organizationId: DEV_BYPASS_ORG_ID,
      role: ROLES.ADMIN,
    };
  }

  const row = await prisma.user.findUnique({
    where: { id: jwtUser.id },
    include: { memberships: { include: { organization: true } } },
  });

  if (row) {
    const membership = row.memberships[0];
    if (!membership) {
      throw Object.assign(new Error("No organization"), { statusCode: 403 });
    }
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      organizationId: membership.organizationId,
      role: membership.role as Role,
    };
  }

  throw Object.assign(new Error("User not found"), { statusCode: 404 });
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
