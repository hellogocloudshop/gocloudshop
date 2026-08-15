"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<{ success: boolean; error?: string }>;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      const result = await action();
      if (!result.success) window.alert(result.error ?? "Something went wrong.");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
      aria-label="Delete"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
