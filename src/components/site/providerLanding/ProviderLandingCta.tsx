import { ArrowRight } from "lucide-react";
import { buildTelegramSupportUrl } from "@/lib/telegram";
import type { ContactChannels } from "@/lib/contact";
import type { ProviderLandingContent } from "@/config/providerLandingContent";

/** Section 15 — closing brand statement + a premium boxed final CTA.
 *  "Contact Support" reuses the exact same Telegram support link as the
 *  Hero and the site-wide contact system (buildTelegramSupportUrl) — no
 *  new contact logic is introduced. */
export function ProviderLandingCta({
  content,
  channels,
}: {
  content: ProviderLandingContent["finalCta"];
  channels: ContactChannels;
}) {
  const supportUrl = buildTelegramSupportUrl(channels.telegramUsername);

  return (
    <section>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{content.heading}</h2>
        <div className="mt-4 space-y-4">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-white/70">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent-blue/15 via-white/[0.03] to-violet/15 p-8 text-center sm:p-12">
        <div className="bg-grid-pattern absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="relative">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{content.boxHeading}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">{content.boxParagraph}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#catalog" className="btn-primary">
              {content.primaryCtaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {content.secondaryCtaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
