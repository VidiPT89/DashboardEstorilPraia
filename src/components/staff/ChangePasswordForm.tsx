"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { changeStaffPassword, type ChangePasswordState } from "@/lib/actions/staff-auth";

const initialState: ChangePasswordState = { error: null, success: false };

export function ChangePasswordForm() {
  const t = useTranslations("staff.password");
  const [state, formAction, isPending] = useActionState(changeStaffPassword, initialState);

  const errorMessage =
    state.error === "mismatch"
      ? t("errorMismatch")
      : state.error === "wrongCurrent"
        ? t("errorWrongCurrent")
        : state.error === "tooShort"
          ? t("errorTooShort")
          : null;

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <h2 className="section-title text-base font-semibold">{t("title")}</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">{t("current")}</span>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">{t("new")}</span>
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">{t("confirm")}</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          />
        </label>
      </div>

      {errorMessage ? <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p> : null}
      {state.success ? <p className="text-sm text-[var(--chart-won)]">{t("success")}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--club-blue)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--club-blue-strong)] disabled:opacity-50 dark:bg-[var(--club-yellow)] dark:text-[var(--club-blue-strong)]"
      >
        {isPending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
