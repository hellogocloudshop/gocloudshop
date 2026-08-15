import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// Admin pages read the authenticated user and fresh DB state on every
// request — never statically prerendered (middleware.ts provides the same
// check at the edge; this is the defense-in-depth server-side re-check).
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-bg-subtle">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar userEmail={user.email ?? null} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
