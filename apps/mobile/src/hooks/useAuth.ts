import { useCallback, useState } from "react";

import { api } from "../services/api";
import { setAccessToken } from "../services/secure-store";
import { setAuthenticatedUser } from "../store/auth.store";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.auth.login({ email, password });
      setAccessToken(result.accessToken);
      setAuthenticatedUser(result.user);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}
