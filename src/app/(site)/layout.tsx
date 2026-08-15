import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactButton } from "@/components/contact/FloatingContactButton";
import { getSiteSettings } from "@/lib/data/settings";
import type { ContactChannels } from "@/lib/contact";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const channels: ContactChannels = {
    telegramUsername: settings.telegram_username,
    whatsappNumber: settings.whatsapp_number,
    telegramChannelUrl: settings.telegram_channel_url,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={settings.site_name} channels={channels} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContactButton channels={channels} />
    </div>
  );
}
