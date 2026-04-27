import type { AuthenticatedUser } from "shared";

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
}
