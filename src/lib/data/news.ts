import { prisma } from "@/lib/prisma";

export async function getNewsPosts(limit = 20) {
  return prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
