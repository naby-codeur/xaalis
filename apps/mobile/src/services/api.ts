import { ApiClient, createEndpoints } from "api-client";

<<<<<<< HEAD
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./secure-store";
import { resetAuth, setAuthenticatedUser } from "../store/auth.store";
import {
  createUnauthorizedHandler,
  refreshSessionWithDeps,
} from "./auth-session";
=======
import { getAccessToken } from "./secure-store";
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7

const baseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

<<<<<<< HEAD
function createRefreshSession(): Promise<boolean> {
  return refreshSessionWithDeps({
    getRefreshToken,
    saveTokens,
    setAuthenticatedUser,
    fetchFn: fetch,
    baseUrl,
  });
}

const handleUnauthorized = createUnauthorizedHandler({
  refreshSession: createRefreshSession,
  clearTokens,
  resetAuth,
});

=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
export const apiClient = new ApiClient({
  baseUrl,
  credentials: "omit",
  getAccessToken,
<<<<<<< HEAD
  onUnauthorized: handleUnauthorized,
});

export const api = createEndpoints(apiClient);

export async function initializeAuthSession(): Promise<boolean> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  if (!accessToken && !refreshToken) {
    return false;
  }

  try {
    const user = await api.auth.me();
    setAuthenticatedUser(user);
    return true;
  } catch {
    const recovered = await handleUnauthorized();
    if (!recovered) return false;
    try {
      const user = await api.auth.me();
      setAuthenticatedUser(user);
      return true;
    } catch {
      await clearTokens();
      resetAuth();
      return false;
    }
  }
}

export async function clearAuthSession(): Promise<void> {
  await clearTokens();
  resetAuth();
}
=======
});

export const api = createEndpoints(apiClient);
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
