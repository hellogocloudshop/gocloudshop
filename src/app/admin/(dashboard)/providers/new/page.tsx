import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderForm } from "@/components/admin/ProviderForm";
import { createProvider } from "@/lib/actions/admin/providers";

export default function NewProviderPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Add Provider" />
      <div className="mt-6">
        <ProviderForm action={createProvider} />
      </div>
    </div>
  );
}
