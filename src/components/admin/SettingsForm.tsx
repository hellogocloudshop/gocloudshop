"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { Field, TextArea, FormError } from "@/components/admin/FormFields";
import { updateSiteSettings } from "@/lib/actions/admin/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (!result.success) setError(result.error);
      else setSuccess(true);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <FormError error={error} />
      {success && <p className="alert-success">Settings saved.</p>}

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">General</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Site Name" name="site_name" defaultValue={settings.site_name} required />
          <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Logo URL" name="logo_url" defaultValue={settings.logo_url ?? ""} />
          <Field label="Favicon URL" name="favicon_url" defaultValue={settings.favicon_url ?? ""} />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Ordering</h2>
        <p className="text-xs text-ink-muted">
          This is the single source of truth for every &quot;Order via Telegram&quot; button on the site.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Telegram Username" name="telegram_username" defaultValue={settings.telegram_username} required placeholder="GoCloudShopSupport" />
          <Field label="Support Email" name="support_email" defaultValue={settings.support_email ?? ""} />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Contact Channels</h2>
        <p className="text-xs text-ink-muted">
          Powers the Telegram / WhatsApp / Telegram Channel contact links shown in the Header, homepage, product
          pages, Footer and the floating contact button. Leave a field blank to hide that channel site-wide until
          it&apos;s ready.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="WhatsApp Number"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number ?? ""}
            placeholder="15551234567 (digits only, with country code)"
          />
          <Field
            label="Telegram Channel URL"
            name="telegram_channel_url"
            defaultValue={settings.telegram_channel_url ?? ""}
            placeholder="https://t.me/GoCloudShopChannel"
          />
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-semibold text-ink">Policies</h2>
        <TextArea label="Privacy Policy" name="privacy_policy" defaultValue={settings.privacy_policy ?? ""} rows={4} />
        <TextArea label="Terms of Service" name="terms_of_service" defaultValue={settings.terms_of_service ?? ""} rows={4} />
        <TextArea label="Refund Policy" name="refund_policy" defaultValue={settings.refund_policy ?? ""} rows={4} />
        <TextArea label="Disclaimer" name="disclaimer" defaultValue={settings.disclaimer ?? ""} rows={4} />
      </section>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Save Settings
      </button>
    </form>
  );
}
