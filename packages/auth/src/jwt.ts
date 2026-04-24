import jwt, { type SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
  sub: string;
  organizationId: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessTtl: string;
  refreshTtl: string;
}

export function signAccessToken(
  payload: AccessTokenPayload,
  config: JwtConfig,
): string {
  const options: SignOptions = { expiresIn: config.accessTtl as SignOptions["expiresIn"] };
  return jwt.sign(payload, config.accessSecret, options);
}

export function signRefreshToken(
  payload: RefreshTokenPayload,
  config: JwtConfig,
): string {
  const options: SignOptions = { expiresIn: config.refreshTtl as SignOptions["expiresIn"] };
  return jwt.sign(payload, config.refreshSecret, options);
}

export function verifyAccessToken(
  token: string,
  config: JwtConfig,
): AccessTokenPayload {
  return jwt.verify(token, config.accessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string,
  config: JwtConfig,
): RefreshTokenPayload {
  return jwt.verify(token, config.refreshSecret) as RefreshTokenPayload;
}
