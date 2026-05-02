import { prisma } from "db";
import type {
  ContributionDto,
  CreateContributionInput,
  UpdateContributionInput,
} from "shared";

function toDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }
  return new Date(value);
}

function toContributionDto(row: {
  id: string;
  organizationId: string;
  memberId: string | null;
  memberName: string;
  amount: number;
  currency: string;
  period: string;
  status: string;
  dueDate: Date;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}): ContributionDto {
  return {
    id: row.id,
    organizationId: row.organizationId,
    memberId: row.memberId,
    memberName: row.memberName,
    amount: row.amount,
    currency: row.currency,
    period: row.period,
    status: row.status as ContributionDto["status"],
    dueDate: row.dueDate.toISOString(),
    paidAt: row.paidAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdBy: row.createdBy,
  };
}

export async function listContributions(organizationId: string) {
  const rows = await prisma.contribution.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map(toContributionDto);
}

export async function createContribution(input: {
  organizationId: string;
  createdBy: string;
  payload: CreateContributionInput;
}) {
  const row = await prisma.contribution.create({
    data: {
      organizationId: input.organizationId,
      memberId: input.payload.memberId ?? null,
      memberName: input.payload.memberName.trim(),
      amount: input.payload.amount,
      currency: input.payload.currency.trim().toUpperCase(),
      period: input.payload.period.trim(),
      status: input.payload.status,
      dueDate: toDate(input.payload.dueDate),
      paidAt: input.payload.status === "PAID" ? new Date() : null,
      createdBy: input.createdBy,
    },
  });
  return toContributionDto(row);
}

export async function updateContribution(input: {
  organizationId: string;
  contributionId: string;
  payload: UpdateContributionInput;
}) {
  const existing = await prisma.contribution.findFirst({
    where: { id: input.contributionId, organizationId: input.organizationId },
  });
  if (!existing) {
    throw Object.assign(new Error("Contribution not found"), { statusCode: 404 });
  }

  const row = await prisma.contribution.update({
    where: { id: input.contributionId },
    data: {
      memberName: input.payload.memberName?.trim(),
      amount: input.payload.amount,
      currency: input.payload.currency?.trim().toUpperCase(),
      period: input.payload.period?.trim(),
      status: input.payload.status,
      dueDate: input.payload.dueDate ? toDate(input.payload.dueDate) : undefined,
      paidAt:
        input.payload.paidAt === undefined
          ? undefined
          : input.payload.paidAt
            ? new Date(input.payload.paidAt)
            : null,
    },
  });
  return toContributionDto(row);
}

export async function deleteContribution(
  organizationId: string,
  contributionId: string,
) {
  const existing = await prisma.contribution.findFirst({
    where: { id: contributionId, organizationId },
  });
  if (!existing) {
    throw Object.assign(new Error("Contribution not found"), { statusCode: 404 });
  }
  await prisma.contribution.delete({ where: { id: contributionId } });
  return { ok: true as const };
}
