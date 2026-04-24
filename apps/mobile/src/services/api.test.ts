import { describe, expect, it, vi } from "vitest";

import { createUnauthorizedHandler, refreshSessionWithDeps } from "./auth-session";

describe("refreshSessionWithDeps", () => {
  it("returns false when refresh token is missing", async () => {
    const saveTokens = vi.fn();
    const setAuthenticatedUser = vi.fn();
    const fetchFn = vi.fn();

    const ok = await refreshSessionWithDeps({
      getRefreshToken: async () => null,
      saveTokens,
      setAuthenticatedUser,
      fetchFn: fetchFn as unknown as typeof fetch,
      baseUrl: "http://localhost:4000",
    });

    expect(ok).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
    expect(saveTokens).not.toHaveBeenCalled();
  });

  it("persists rotated tokens and user on refresh success", async () => {
    const saveTokens = vi.fn(async () => undefined);
    const setAuthenticatedUser = vi.fn();
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        accessToken: "next-access",
        refreshToken: "next-refresh",
        user: {
          id: "u1",
          email: "user@test.local",
          name: "User",
          createdAt: new Date(0).toISOString(),
          organizationId: "org1",
          role: "ADMIN",
        },
      }),
    }));

    const ok = await refreshSessionWithDeps({
      getRefreshToken: async () => "current-refresh",
      saveTokens,
      setAuthenticatedUser,
      fetchFn: fetchFn as unknown as typeof fetch,
      baseUrl: "http://localhost:4000",
    });

    expect(ok).toBe(true);
    expect(saveTokens).toHaveBeenCalledWith({
      accessToken: "next-access",
      refreshToken: "next-refresh",
    });
    expect(setAuthenticatedUser).toHaveBeenCalledTimes(1);
  });
});

describe("createUnauthorizedHandler", () => {
  it("coalesces concurrent refresh attempts into one call", async () => {
    const refreshSession = vi.fn(async () => true);
    const clearTokens = vi.fn(async () => undefined);
    const resetAuth = vi.fn();
    const handleUnauthorized = createUnauthorizedHandler({
      refreshSession,
      clearTokens,
      resetAuth,
    });

    const [r1, r2] = await Promise.all([
      handleUnauthorized(),
      handleUnauthorized(),
    ]);

    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(clearTokens).not.toHaveBeenCalled();
    expect(resetAuth).not.toHaveBeenCalled();
  });

  it("clears session when refresh fails", async () => {
    const clearTokens = vi.fn(async () => undefined);
    const resetAuth = vi.fn();
    const handleUnauthorized = createUnauthorizedHandler({
      refreshSession: async () => false,
      clearTokens,
      resetAuth,
    });

    const ok = await handleUnauthorized();

    expect(ok).toBe(false);
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(resetAuth).toHaveBeenCalledTimes(1);
  });
});
