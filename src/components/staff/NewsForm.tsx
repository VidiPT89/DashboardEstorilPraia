"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsFormState } from "@/lib/actions/news";

type NewsFormDefaults = {
  title: string;
  slug: string;
  content: string;
  sourceUrl: string;
  publishedAt: string;
};

type NewsFormProps = {
  action: (prevState: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  mode: "create" | "edit";
  defaultValues?: NewsFormDefaults;
};

const initialState: NewsFormState = { error: null };

function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function NewsForm({ action, mode, defaultValues }: NewsFormProps) {
  const t = useTranslations("staff.newsForm");
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <h2 className="section-title text-base font-semibold">
        {mode === "create" ? t("createTitle") : t("editTitle")}
      </h2>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("titleLabel")}</span>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("slugLabel")}</span>
        <input
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={defaultValues?.slug}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-[var(--muted)]">{t("slugHint")}</span>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("contentLabel")}</span>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={defaultValues?.content}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("sourceUrlLabel")}</span>
        <input
          type="url"
          name="sourceUrl"
          defaultValue={defaultValues?.sourceUrl}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">{t("publishedAtLabel")}</span>
        <input
          type="date"
          name="publishedAt"
          required
          defaultValue={defaultValues ? toDateInputValue(defaultValues.publishedAt) : undefined}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </label>

      {state.error ? <p className="text-sm text-red-600 dark:text-red-400">{t("error")}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--club-blue)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--club-blue-strong)] disabled:opacity-50 dark:bg-[var(--club-yellow)] dark:text-[var(--club-blue-strong)]"
        >
          {isPending ? t("saving") : t("save")}
        </button>
        <Link href="/staff" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
