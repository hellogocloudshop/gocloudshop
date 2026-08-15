import { getSiteSettings } from "@/lib/data/settings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Settings" description="Global site configuration" />
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
