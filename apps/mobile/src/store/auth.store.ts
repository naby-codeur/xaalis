import type { AuthenticatedUser } from "shared";

import { setAccessToken } from "../services/secure-store";

interface AuthState {
  user: AuthenticatedUser | null;
}

const state: AuthState = { user: null };

export function setAuthenticatedUser(user: AuthenticatedUser | null): void {
  state.user = user;
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
  return state.user;
}

export function resetAuth(): void {
  state.user = null;
  setAccessToken(null);
}
