import { prisma } from "db";

export async function listProjects(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
