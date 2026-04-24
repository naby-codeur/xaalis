import type { AuthenticatedUser } from "shared";

export type RefreshDeps = {
  getRefreshToken: () => Promise<string | null>;
  saveTokens: (input: {
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => Promise<void>;
  setAuthenticatedUser: (user: AuthenticatedUser) => void;
  fetchFn: typeof fetch;
  baseUrl: string;
};

export type UnauthorizedDeps = {
  refreshSession: () => Promise<boolean>;
  clearTokens: () => Promise<void>;
  resetAuth: () => void;
};

export async function refreshSessionWithDeps(deps: RefreshDeps): Promise<boolean> {
  const refreshToken = await deps.getRefreshToken();
  if (!refreshToken) return false;

  const response = await deps.fetchFn(new URL("/v1/auth/refresh", deps.baseUrl), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as {
    accessToken: string;
    refreshToken?: string;
    user?: AuthenticatedUser;
  };
  await deps.saveTokens({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken ?? refreshToken,
  });
  if (payload.user) {
    deps.setAuthenticatedUser(payload.user);
  }
  return true;
}

export function createUnauthorizedHandler(
  deps: UnauthorizedDeps,
): () => Promise<boolean> {
  let refreshInFlight: Promise<boolean> | null = null;
  return async function handleUnauthorized(): Promise<boolean> {
    if (!refreshInFlight) {
      refreshInFlight = deps
        .refreshSession()
        .catch(() => false)
        .finally(() => {
          refreshInFlight = null;
        });
    }
    const refreshed = await refreshInFlight;
    if (!refreshed) {
      await deps.clearTokens();
      deps.resetAuth();
    }
    return refreshed;
  };
}
