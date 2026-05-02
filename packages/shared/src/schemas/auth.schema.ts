import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100).optional(),
  organizationName: z.string().min(1).max(100),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export const updateOrganizationLogoSchema = z.object({
  logoUrl: z.string().min(1).max(2_000_000).nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type UpdateOrganizationLogoInput = z.infer<typeof updateOrganizationLogoSchema>;
