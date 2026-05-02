import { prisma } from "db";
import type {
  CreateOrganizationMemberInput,
  OrganizationMemberDto,
  UpdateOrganizationMemberInput,
} from "shared";

function toMemberDto(row: {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  phone: string | null;
  notes: string | null;
  targetRole: string;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}): OrganizationMemberDto {
  return {
    id: row.id,
    organizationId: row.organizationId,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    targetRole: row.targetRole as OrganizationMemberDto["targetRole"],
    joinedAt: row.joinedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdBy: row.createdBy,
  };
}

export async function listMembers(organizationId: string) {
  const rows = await prisma.organizationMember.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map(toMemberDto);
}

export async function createMember(input: {
  organizationId: string;
  createdBy: string;
  payload: CreateOrganizationMemberInput;
}) {
  const row = await prisma.organizationMember.create({
    data: {
      organizationId: input.organizationId,
      fullName: input.payload.fullName.trim(),
      email: input.payload.email.trim().toLowerCase(),
      phone: input.payload.phone?.trim() || null,
      notes: input.payload.notes?.trim() || null,
      targetRole: input.payload.targetRole,
      createdBy: input.createdBy,
    },
  });
  return toMemberDto(row);
}

export async function updateMember(input: {
  organizationId: string;
  memberId: string;
  payload: UpdateOrganizationMemberInput;
}) {
  const existing = await prisma.organizationMember.findFirst({
    where: { id: input.memberId, organizationId: input.organizationId },
  });
  if (!existing) {
    throw Object.assign(new Error("Member not found"), { statusCode: 404 });
  }

  const row = await prisma.organizationMember.update({
    where: { id: input.memberId },
    data: {
      fullName: input.payload.fullName?.trim(),
      email: input.payload.email?.trim().toLowerCase(),
      phone:
        input.payload.phone === undefined ? undefined : input.payload.phone?.trim() || null,
      notes:
        input.payload.notes === undefined ? undefined : input.payload.notes?.trim() || null,
      targetRole: input.payload.targetRole,
    },
  });
  return toMemberDto(row);
}

export async function deleteMember(organizationId: string, memberId: string) {
  const existing = await prisma.organizationMember.findFirst({
    where: { id: memberId, organizationId },
  });
  if (!existing) {
    throw Object.assign(new Error("Member not found"), { statusCode: 404 });
  }
  await prisma.organizationMember.delete({ where: { id: memberId } });
  return { ok: true as const };
}
