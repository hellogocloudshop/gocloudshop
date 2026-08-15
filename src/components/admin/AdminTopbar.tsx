"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminTopbar({ userEmail }: { userEmail: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {userEmail && <span className="hidden text-sm text-ink-muted sm:inline">{userEmail}</span>}
        <button type="button" onClick={handleSignOut} className="btn-ghost !px-3 !py-1.5 text-xs">
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign Out
        </button>
      </div>
    </header>
  );
}
