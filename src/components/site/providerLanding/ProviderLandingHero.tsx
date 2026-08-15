import { ArrowRight, Cloud, Cpu, Sparkles, Wallet, type LucideIcon } from "lucide-react";
import { buildTelegramSupportUrl } from "@/lib/telegram";
import type { ContactChannels } from "@/lib/contact";
import type { ProviderLandingContent } from "@/config/providerLandingContent";

const VISUAL_ICONS: Record<string, LucideIcon> = {
  AWS: Sparkles,
  Cloud: Cloud,
  AI: Sparkles,
  Compute: Cpu,
  Credits: Wallet,
};

/**
 * Premium dark hero content for a provider's "Buy {Provider} Account"
 * landing page. Expects to be rendered inside the parent's shared
 * `surface-dark` wrapper (see ProviderDetailView) so the whole page shares
 * one continuous dark background, grid pattern and glow blobs rather than
 * stacking a second dark panel directly under the header. Purely
 * presentational — the primary CTA scrolls down to the existing product
 * catalog (#catalog) and the secondary CTA opens the same Telegram support
 * link used everywhere else on the site (buildTelegramSupportUrl), so no new
 * order/contact logic is introduced here. Abstract CSS visuals only — no AWS
 * screenshots or copied branding.
 */
export function ProviderLandingHero({
  content,
  channels,
}: {
  content: ProviderLandingContent["hero"];
  channels: ContactChannels;
}) {
  const supportUrl = buildTelegramSupportUrl(channels.telegramUsername);

  return (
    <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
      <div className="max-w-xl">
        <p className="section-eyebrow text-sky-accent">Amazon Web Services</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          <span className="text-gradient-premium">{content.heading}</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70">{content.paragraph}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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

      {/* Abstract cloud/AI visual panel — no AWS screenshots or copied branding. */}
      <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-3 sm:grid-cols-3 lg:mx-0 lg:max-w-none">
        {content.visualLabels.map((label, index) => {
          const Icon = VISUAL_ICONS[label] ?? Cloud;
          return (
            <div
              key={label}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl ${
                index % 2 === 0 ? "sm:translate-y-3" : ""
              }`}
            >
              <span className="icon-tile icon-tile-a">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
