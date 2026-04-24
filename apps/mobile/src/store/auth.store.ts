import type { AuthenticatedUser } from "shared";

<<<<<<< HEAD
=======
import { setAccessToken } from "../services/secure-store";

>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
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
<<<<<<< HEAD
=======
  setAccessToken(null);
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
}
