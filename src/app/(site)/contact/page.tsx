import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import type { ContactChannels } from "@/lib/contact";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/site/ContactForm";
import { ContactLinks } from "@/components/contact/ContactLinks";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with GoCloudShop support via Telegram, WhatsApp, our Telegram Channel, email or our contact form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <SectionHeading
        eyebrow="Support"
        title="Contact GoCloudShop"
        subtitle="Reach our team directly — Telegram and WhatsApp are the fastest ways to get a response."
        className="mt-4"
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <ContactLinks channels={channels} variant="list" />
          {settings.support_email && (
            <a href={`mailto:${settings.support_email}`} className="card-surface card-surface-hover flex items-center gap-3 p-5">
              <span className="icon-tile icon-tile-b">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-ink">Email</p>
                <p className="text-sm text-ink-muted">{settings.support_email}</p>
              </div>
            </a>
          )}
        </div>

        <div className="card-surface p-6">
          <h2 className="font-semibold text-ink">Send a Message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
