import { useCallback, useState } from "react";

import { api, tryAutoDevBypassLogin } from "../services/api";
import { saveTokens } from "../services/secure-store";
import { setAuthenticatedUser } from "../store/auth.store";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commitAuth = useCallback(
    async (result: {
      accessToken: string;
      refreshToken?: string;
      user: Parameters<typeof setAuthenticatedUser>[0];
    }) => {
      await saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? null,
      });
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
        return await commitAuth(result);
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
        return await commitAuth(result);
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
      const ok = await tryAutoDevBypassLogin();
      if (!ok) throw new Error("Dev login failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dev login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, register, devLogin, loading, error };
}
