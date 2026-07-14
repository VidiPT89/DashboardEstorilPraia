"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteNewsPost } from "@/lib/actions/news";

type DeletePostButtonProps = {
  postId: string;
  locale: string;
};

export function DeletePostButton({ postId, locale }: DeletePostButtonProps) {
  const t = useTranslations("staff.dashboard");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteNewsPost(locale, postId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="font-medium text-red-600 transition-colors hover:underline disabled:opacity-50 dark:text-red-400"
    >
      {isPending ? t("deleteSubmitting") : t("delete")}
    </button>
  );
}
