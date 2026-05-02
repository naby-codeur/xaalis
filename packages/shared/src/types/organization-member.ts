import type { Role } from "../constants/roles";

/** Membre annuaire (contact) — API `/v1/members`. */
export interface OrganizationMemberDto {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  phone: string | null;
  notes: string | null;
  targetRole: Role;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
