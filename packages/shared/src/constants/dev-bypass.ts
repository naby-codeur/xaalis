import { ROLES } from "./roles";
import type { AuthenticatedUser } from "../types/user";

/** Aligné sur `apps/api` — identité synthétique pour `DEV_AUTH_BYPASS`. */
export const DEV_BYPASS_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEV_BYPASS_ORG_ID = "00000000-0000-4000-8000-000000000002";

export function getDevBypassAuthenticatedUser(): AuthenticatedUser {
  return {
    id: DEV_BYPASS_USER_ID,
    email: "dev@local.test",
    name: "Utilisateur dev",
    createdAt: new Date(0).toISOString(),
    organizationId: DEV_BYPASS_ORG_ID,
    role: ROLES.ADMIN,
    organizationLogoUrl: null,
  };
}
