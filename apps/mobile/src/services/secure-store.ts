<<<<<<< HEAD
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "xaalis.accessToken";
const REFRESH_TOKEN_KEY = "xaalis.refreshToken";

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let hydrated = false;

async function hydrateTokens(): Promise<void> {
  if (hydrated) return;
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  cachedAccessToken = accessToken;
  cachedRefreshToken = refreshToken;
  hydrated = true;
}

export async function getAccessToken(): Promise<string | null> {
  await hydrateTokens();
  return cachedAccessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  await hydrateTokens();
  return cachedRefreshToken;
}

export async function saveTokens(input: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): Promise<void> {
  await hydrateTokens();

  if (input.accessToken !== undefined) {
    cachedAccessToken = input.accessToken;
    if (input.accessToken) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, input.accessToken);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
  }

  if (input.refreshToken !== undefined) {
    cachedRefreshToken = input.refreshToken;
    if (input.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, input.refreshToken);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  }
}

export async function clearTokens(): Promise<void> {
  await saveTokens({ accessToken: null, refreshToken: null });
}
=======
let cachedAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return cachedAccessToken;
}

export function setAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

// TODO: remplacer par expo-secure-store pour le refresh token.
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
