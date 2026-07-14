import { prisma } from "@/lib/prisma";

export async function getFinanceSnapshots() {
  return prisma.financeSnapshot.findMany({
    orderBy: { season: "asc" },
  });
}
