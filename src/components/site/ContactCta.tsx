import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "@/components/contact/ContactLinks";
import { FINAL_CTA_CONTENT } from "@/config/homepageContent";

export function ContactCta({ channels }: { channels: ContactChannels }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="card-premium">
        <div className="card-premium-inner flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{FINAL_CTA_CONTENT.heading}</h2>
          <p className="max-w-2xl text-ink-muted">{FINAL_CTA_CONTENT.paragraph}</p>
          <p className="max-w-lg font-semibold text-ink">{FINAL_CTA_CONTENT.tagline}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/cloud-accounts" className="btn-primary">
              Browse Cloud Accounts <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ContactLinks channels={channels} variant="buttons" />
          </div>
          {channels.telegramChannelUrl && (
            <a
              href={channels.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-blue"
            >
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Join our Telegram Channel for updates and announcements
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
