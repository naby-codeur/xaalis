import { z } from "zod";

export const contributionStatusSchema = z.enum(["PENDING", "PAID", "LATE"]);

export const createContributionSchema = z.object({
  memberId: z.string().length(24).optional().nullable(),
  memberName: z.string().min(1).max(200),
  amount: z.number().positive(),
  currency: z.string().min(1).max(10).default("XOF"),
  period: z.string().min(1).max(200),
  status: contributionStatusSchema.default("PENDING"),
  dueDate: z.union([
    z.string().datetime(),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ]),
});

export const updateContributionSchema = z.object({
  memberName: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().min(1).max(10).optional(),
  period: z.string().min(1).max(200).optional(),
  status: contributionStatusSchema.optional(),
  dueDate: z
    .union([
      z.string().datetime(),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    ])
    .optional(),
  paidAt: z.string().datetime().nullable().optional(),
});

export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type UpdateContributionInput = z.infer<typeof updateContributionSchema>;
