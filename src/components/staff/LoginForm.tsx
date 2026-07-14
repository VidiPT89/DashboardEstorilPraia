"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("staff.login");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!result || result.error) {
      setIsSubmitting(false);
      setError(t("error"));
      return;
    }

    router.push("/staff");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("email")}</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--club-blue)] dark:focus:border-[var(--club-yellow)]"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("password")}</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--club-blue)] dark:focus:border-[var(--club-yellow)]"
        />
      </label>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--club-blue)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--club-blue-strong)] disabled:opacity-50 dark:bg-[var(--club-yellow)] dark:text-[var(--club-blue-strong)]"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
