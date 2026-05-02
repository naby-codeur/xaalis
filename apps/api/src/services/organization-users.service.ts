import { prisma } from "db";
import type { OrganizationUserDto } from "shared";

export async function listOrganizationUsers(
  organizationId: string,
): Promise<OrganizationUserDto[]> {
  const rows = await prisma.membership.findMany({
    where: { organizationId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return rows.map((m) => ({
    membershipId: m.id,
    userId: m.userId,
    email: m.user.email,
    name: m.user.name,
    role: m.role,
    joinedAt: m.createdAt.toISOString(),
  }));
}
