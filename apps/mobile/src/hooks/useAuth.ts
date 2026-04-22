import { useCallback, useState } from "react";

import { api, apiClient } from "../services/api";
import { setAccessToken } from "../services/secure-store";
import { setAuthenticatedUser } from "../store/auth.store";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commitAuth = useCallback(
    (result: { accessToken: string; user: Parameters<typeof setAuthenticatedUser>[0] }) => {
      setAccessToken(result.accessToken);
      setAuthenticatedUser(result.user);
      return result;
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.auth.login({ email, password });
        return commitAuth(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [commitAuth],
  );

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      organizationName: string;
      name?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.auth.register(input);
        return commitAuth(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Register failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [commitAuth],
  );

  const devLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.request<{
        accessToken: string;
        user: Parameters<typeof setAuthenticatedUser>[0];
      }>("POST", "/v1/auth/dev-login");
      return commitAuth(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dev login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [commitAuth]);

  return { login, register, devLogin, loading, error };
}
