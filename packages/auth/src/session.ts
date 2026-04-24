import crypto from "node:crypto";

export interface IssuedSession {
  sessionId: string;
  refreshTokenHash: string;
  expiresAt: Date;
}

export function hashRefreshToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function computeExpiry(ttlSeconds: number): Date {
  return new Date(Date.now() + ttlSeconds * 1000);
}
