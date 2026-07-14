"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireStaffSession, UnauthorizedError } from "@/lib/actions/staff-session";

const newsSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalidSlug"),
  content: z.string().trim().min(10),
  sourceUrl: z.union([z.string().trim().url(), z.literal("")]),
  publishedAt: z.string().min(1),
});

export type NewsFormState = { error: string | null };

function revalidateNewsPages(locale: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/noticias`);
  revalidatePath(`/${locale}/staff`);
}

export async function createNewsPost(
  locale: string,
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  try {
    await requireStaffSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) return { error: "unauthorized" };
    throw error;
  }

  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    sourceUrl: formData.get("sourceUrl") ?? "",
    publishedAt: formData.get("publishedAt"),
  });
  if (!parsed.success) return { error: "invalid" };

  try {
    await prisma.newsPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        sourceUrl: parsed.data.sourceUrl || null,
        publishedAt: new Date(parsed.data.publishedAt),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "duplicateSlug" };
    }
    throw error;
  }

  revalidateNewsPages(locale);
  redirect(`/${locale}/staff`);
}

export async function updateNewsPost(
  locale: string,
  postId: string,
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  try {
    await requireStaffSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) return { error: "unauthorized" };
    throw error;
  }

  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    sourceUrl: formData.get("sourceUrl") ?? "",
    publishedAt: formData.get("publishedAt"),
  });
  if (!parsed.success) return { error: "invalid" };

  try {
    await prisma.newsPost.update({
      where: { id: postId },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        sourceUrl: parsed.data.sourceUrl || null,
        publishedAt: new Date(parsed.data.publishedAt),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "duplicateSlug" };
    }
    throw error;
  }

  revalidateNewsPages(locale);
  redirect(`/${locale}/staff`);
}

export async function deleteNewsPost(locale: string, postId: string): Promise<void> {
  await requireStaffSession();
  await prisma.newsPost.delete({ where: { id: postId } });
  revalidateNewsPages(locale);
}
