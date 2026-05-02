import type { Role } from "../constants/roles";

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthenticatedUser extends PublicUser {
  organizationId: string;
  role: Role;
  organizationLogoUrl?: string | null;
}
