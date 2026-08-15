"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Field, Select, FormError } from "@/components/admin/FormFields";
import { inviteStaffUser } from "@/lib/actions/admin/users";

export function InviteUserForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await inviteStaffUser(formData);
      if (!result.success) setError(result.error);
      else setSuccess(true);
    });
  }

  return (
    <form action={handleSubmit} className="card-surface space-y-4 p-6">
      <FormError error={error} />
      {success && <p className="alert-success">Invitation sent.</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Name" name="name" />
        <Field label="Email" name="email" type="email" required />
        <Select label="Role" name="role" defaultValue="editor">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </Select>
      </div>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Send Invite
      </button>
    </form>
  );
}
