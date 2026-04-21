"use client";

import { useCallback, useState } from "react";

import { api } from "../lib/api-client";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      return await api.auth.login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}
