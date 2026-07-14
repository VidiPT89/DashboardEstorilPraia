"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireStaffSession, UnauthorizedError } from "@/lib/actions/staff-session";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, { message: "mismatch" });

export type ChangePasswordState = { error: string | null; success: boolean };

export async function changeStaffPassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  let session;
  try {
    session = await requireStaffSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) return { error: "unauthorized", success: false };
    throw error;
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const isMismatch = parsed.error.issues.some((issue) => issue.message === "mismatch");
    return { error: isMismatch ? "mismatch" : "tooShort", success: false };
  }

  const staffUser = await prisma.staffUser.findUnique({ where: { id: session.user.id } });
  if (!staffUser) return { error: "unauthorized", success: false };

  const isCurrentValid = await bcrypt.compare(parsed.data.currentPassword, staffUser.passwordHash);
  if (!isCurrentValid) return { error: "wrongCurrent", success: false };

  const newPasswordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.staffUser.update({
    where: { id: staffUser.id },
    data: { passwordHash: newPasswordHash },
  });

  return { error: null, success: true };
}
