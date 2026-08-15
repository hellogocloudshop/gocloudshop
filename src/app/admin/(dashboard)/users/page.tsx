import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InviteUserForm } from "@/components/admin/InviteUserForm";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("profiles").select("*").order("created_at") : { data: [] };
  const profiles = (data ?? []) as Profile[];

  return (
    <div>
      <AdminPageHeader title="Users" description="Staff accounts with admin dashboard access" />

      <div className="mt-6">
        <InviteUserForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg-subtle text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3 text-ink">{profile.name ?? profile.id}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect id={profile.id} role={profile.role} />
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-ink-muted">
                  No staff users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
