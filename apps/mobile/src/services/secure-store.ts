let cachedAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return cachedAccessToken;
}

export function setAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

// TODO: remplacer par expo-secure-store pour le refresh token.
