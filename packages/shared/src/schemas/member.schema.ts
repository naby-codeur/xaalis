import { z } from "zod";

import { ROLES } from "../constants/roles";

/** Rôle cible pour le membre (pas de super-admin au niveau annuaire). */
const targetRoleEnum = z.enum([
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.CASHIER,
  ROLES.VIEWER,
]);

export const createOrganizationMemberSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  targetRole: targetRoleEnum.default(ROLES.VIEWER),
});

export const updateOrganizationMemberSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  email: z.string().email().max(200).optional(),
  phone: z.string().max(50).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  targetRole: targetRoleEnum.optional(),
});

export type CreateOrganizationMemberInput = z.infer<
  typeof createOrganizationMemberSchema
>;
export type UpdateOrganizationMemberInput = z.infer<
  typeof updateOrganizationMemberSchema
>;
