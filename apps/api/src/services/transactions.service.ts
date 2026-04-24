import { prisma } from "db";

export async function listTransactions(organizationId: string) {
  return prisma.transaction.findMany({
    where: { organizationId },
    orderBy: { occurredAt: "desc" },
    take: 50,
  });
}
