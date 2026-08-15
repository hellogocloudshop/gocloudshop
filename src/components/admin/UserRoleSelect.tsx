"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateUserRole } from "@/lib/actions/admin/users";
import type { UserRole } from "@/lib/types";

export function UserRoleSelect({ id, role }: { id: string; role: UserRole }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as UserRole;
    startTransition(async () => {
      await updateUserRole(id, newRole);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={role}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
      >
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-ink-muted" aria-hidden="true" />}
    </div>
  );
}
