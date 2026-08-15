import { MapPin, CheckCircle2, X, XCircle, AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingIconItem, LandingListItem, ProviderLandingContent } from "@/config/providerLandingContent";

/** Shared heading block for every long-form section below the catalog.
 *  Long-form copy is capped at a comfortable reading width (max-w-3xl);
 *  grids/panels below it are free to use the full container width. */
function LandingSectionHeader({
  eyebrow,
  heading,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="section-eyebrow text-sky-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-white/70">{intro}</p>}
    </div>
  );
}

function LandingClosing({ text, align = "left" }: { text: string; align?: "left" | "center" }) {
  return <p className={cn("mt-8 max-w-3xl text-sm leading-relaxed text-white/60", align === "center" && "mx-auto text-center")}>{text}</p>;
}

function IconCard({ item, iconTile = "icon-tile-a" }: { item: LandingIconItem; iconTile?: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/40 hover:bg-white/[0.06]">
      <span className={cn("icon-tile h-11 w-11", iconTile)}>
        <item.icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-white">{item.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{item.description}</p>
    </div>
  );
}

/** Short introduction banner shown between the Hero and the product
 *  catalog — deliberately brief so the catalog stays high on the page. */
export function ProviderIntroSection({ content }: { content: ProviderLandingContent["intro"] }) {
  return (
    <div className="text-center">
      <p className="section-eyebrow justify-center text-sky-accent">{content.eyebrow}</p>
      <h2 className="mx-auto mt-2 max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">{content.heading}</h2>
    </div>
  );
}

/** Section 4 / 9 — a simple, uncluttered informational block reused for
 *  "Standard AWS Accounts", "Starter / Free Trial Accounts" and Azure's "Pay
 *  As You Go" (via its optional short bullet list). */
export function ProviderInfoBlock({
  id,
  content,
  variant = "plain",
}: {
  id?: string;
  content: { heading: string; paragraph: string; items?: string[]; closing?: string };
  variant?: "plain" | "highlight";
}) {
  const list = content.items && content.items.length > 0 && (
    <ul className="mt-4 space-y-2">
      {content.items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
  const closing = content.closing && <p className="mt-4 text-sm leading-relaxed text-white/60">{content.closing}</p>;

  return (
    <section id={id} className="scroll-mt-28">
      {variant === "highlight" ? (
        <div className="rounded-2xl border border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 via-white/[0.03] to-transparent p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white">{content.heading}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">{content.paragraph}</p>
          {list}
          {closing}
        </div>
      ) : (
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold text-white">{content.heading}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{content.paragraph}</p>
          {list}
          {closing}
        </div>
      )}
    </section>
  );
}

/** Section 1 — Why Choose Go Cloud Shop: a compact feature strip. */
export function ProviderBenefitsGrid({ id, content }: { id: string; content: ProviderLandingContent["benefits"] }) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader eyebrow="Why Go Cloud Shop" heading={content.heading} intro={content.intro} />
      <div
        className={cn(
          "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2",
          // 5 items reads best as one row; 6 (e.g. Linode's "2 rows x 3")
          // reads best as a balanced 3-column grid instead.
          content.items.length >= 6 ? "lg:grid-cols-3" : "lg:grid-cols-5"
        )}
      >
        {content.items.map((item) => (
          <IconCard key={item.title} item={item} iconTile="icon-tile-a" />
        ))}
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Section 2 — Safety/Trust: visually distinct panel (bordered container,
 *  2-column layout) so it doesn't read as a repeat of the benefits grid. */
export function ProviderTrustSection({ id, content }: { id: string; content: ProviderLandingContent["trust"] }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
      <LandingSectionHeader eyebrow="Security & Trust" heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.items.map((item) => (
          <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="icon-tile icon-tile-b h-11 w-11 shrink-0">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Section 3 — category overview: compact, non-clickable blocks (not full
 *  cards) giving a quick visual map of every account type below. */
export function ProviderCategoryGrid({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["categoryOptions"]> }) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader eyebrow="Account Options" heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {content.items.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <span className="icon-tile icon-tile-c h-10 w-10">
              <item.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="text-xs leading-snug text-white/55">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Sections 5 / 6 — Credits & Compute: a horizontal tier progression
 *  (informational only — the real purchasable rows live in the catalog
 *  above, this never duplicates price/availability data). */
export function ProviderTierShowcase({
  id,
  content,
  icon: Icon,
  iconTile = "icon-tile-a",
}: {
  id: string;
  content: { heading: string; intro: string; tiers: LandingListItem[]; closing?: string };
  icon: LucideIcon;
  iconTile?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
        {content.tiers.map((tier, index) => (
          <div
            key={tier.label}
            className="flex min-w-[15rem] shrink-0 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:min-w-0 sm:shrink"
          >
            <span className={cn("icon-tile h-10 w-10 shrink-0 text-xs font-bold", iconTile)}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">Tier {index + 1}</p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-white">{tier.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{tier.description}</p>
            </div>
          </div>
        ))}
      </div>
      {content.closing && <LandingClosing text={content.closing} />}
    </section>
  );
}

/** Section 7 — AWS AI: the most visually rich grid on the page. */
export function ProviderAIFeatureGrid({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["ai"]> }) {
  return (
    <section id={id} className="scroll-mt-28 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-secondary/10 via-white/[0.03] to-violet/10 p-6 sm:p-10">
      <div className="animate-glow pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-violet/20 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <LandingSectionHeader eyebrow="AI & Machine Learning" heading={content.heading} intro={content.intro} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {content.features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-violet/50 hover:bg-white/[0.08]"
            >
              <span className="icon-tile icon-tile-d mx-auto h-11 w-11">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-white">{feature.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl">
          {content.closingLabel && <p className="font-semibold text-white">{content.closingLabel}</p>}
          <p className={cn("text-sm leading-relaxed text-white/60", content.closingLabel && "mt-2")}>{content.closing}</p>
        </div>
      </div>
    </section>
  );
}

/** Section 8 — AI account variants: a compact comparison list, not seven
 *  large cards. */
export function ProviderComparisonList({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["aiVariants"]> }) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="divide-y divide-white/10">
          {content.rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 p-4 sm:p-5">
              <p className="text-sm font-semibold leading-snug text-white">{row.label}</p>
              <p className="text-xs leading-relaxed text-white/55">{row.description}</p>
            </div>
          ))}
        </div>
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Section 10 — Aged accounts: an enterprise-styled panel with a gradient
 *  border to signal a higher tier. */
export function ProviderAgedSection({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["aged"]> }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="card-premium">
        <div className="card-premium-inner !bg-[#0d1326] p-6 sm:p-10">
          <LandingSectionHeader eyebrow="Enterprise Reliability" heading={content.heading} intro={content.intro} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.items.map((item) => (
              <IconCard key={item.title} item={item} iconTile="icon-tile-b" />
            ))}
          </div>
          <LandingClosing text={content.closing} />
        </div>
      </div>
    </section>
  );
}

/** Section 11 — Bulk accounts: a wide B2B benefits strip. */
export function ProviderBulkSection({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["bulk"]> }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
      <LandingSectionHeader eyebrow="For Agencies & Resellers" heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {content.items.map((item) => (
          <IconCard key={item.title} item={item} iconTile="icon-tile-c" />
        ))}
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Section 12 — Regions: honest chip list, no map imagery. */
export function ProviderRegionsSection({ id, content }: { id: string; content: NonNullable<ProviderLandingContent["regions"]> }) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader eyebrow="Global Coverage" heading={content.heading} intro={content.intro} />
      <div className="mt-6 flex flex-wrap gap-2.5">
        {content.list.map((region) => (
          <span
            key={region}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80"
          >
            <MapPin className="h-3.5 w-3.5 text-sky-accent" aria-hidden="true" />
            {region}
          </span>
        ))}
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Section 13 — How to Buy: a numbered-step timeline, horizontal on
 *  desktop, stacked on mobile. Works for either a short 3-step flow (AWS,
 *  single row with a full-width connecting line) or a longer 6-step flow
 *  (Google Cloud, a 2-3 column grid — a single line can't honestly connect
 *  steps across wrapped rows, so it's dropped there in favor of a clean
 *  numbered grid, which still reads as a clear step-by-step process). */
export function ProviderHowToBuy({ id, content }: { id: string; content: ProviderLandingContent["howToBuy"] }) {
  const singleRow = content.steps.length <= 3;

  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} align="center" />
      <div
        className={cn(
          "relative mt-10 grid grid-cols-1 gap-8 sm:gap-x-6 sm:gap-y-10",
          singleRow ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {singleRow && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t border-dashed border-white/15 sm:block"
            aria-hidden="true"
          />
        )}
        {content.steps.map((step, index) => (
          <div key={step.label} className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-violet text-base font-extrabold text-white shadow-[var(--shadow-glow-blue)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 font-semibold text-white">{step.label}</p>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-white/60">{step.description}</p>
          </div>
        ))}
      </div>
      <LandingClosing text={content.closing} align="center" />
    </section>
  );
}

/** "What Does It Mean to Buy a {Provider} Account?" — a two-column
 *  overview: intro paragraphs on the left, a grid of core service icons on
 *  the right. */
export function ProviderServiceOverview({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["serviceOverview"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{content.heading}</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="max-w-3xl space-y-4">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-white/70">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {content.services.map((service) => (
            <div
              key={service.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/40 hover:bg-white/[0.06]"
            >
              <span className="icon-tile icon-tile-a h-11 w-11">
                <service.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white">{service.label}</span>
              {service.description && <span className="text-xs leading-snug text-white/55">{service.description}</span>}
            </div>
          ))}
        </div>
      </div>
      {content.closing && <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/60">{content.closing}</p>}
    </section>
  );
}

/** Account-type detail section with two labeled bullet lists (e.g.
 *  "Standard Verified Google Cloud Account" — Ideal for / Features
 *  include). */
export function ProviderDualListSection({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["standardAccountDetail"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.idealForLabel}</p>
          <ul className="mt-4 space-y-2.5">
            {content.idealFor.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.featuresLabel}</p>
          <ul className="mt-4 space-y-2.5">
            {content.features.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Neutral two-item spec comparison (e.g. Oracle's Free Tier: Ampere A1 ARM
 *  vs VM.Standard.E2.1.Micro) — unlike ProviderBeforeAfterSection, neither
 *  side is framed as a problem; both cards use the same neutral styling. */
export function ProviderSpecComparison({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["freeTier"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {content.tiers.map((tier) => (
          <div key={tier.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-base font-semibold text-white">{tier.title}</p>
            {tier.description && <p className="mt-1 text-sm leading-relaxed text-white/60">{tier.description}</p>}
            <ul className="mt-4 space-y-2.5">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Multi-category account-type explainer (e.g. Oracle's "$300 Credit / Aged
 *  / Upgraded" three-column layout) — purely informational; the live
 *  catalog above remains the only purchasable source of truth. */
export function ProviderAccountTypesGrid({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["accountTypesGrid"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {content.categories.map((category) => (
          <div key={category.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-base font-semibold text-white">{category.title}</p>
            <ul className="mt-4 space-y-2.5">
              {category.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {category.closing && <p className="mt-4 text-sm leading-relaxed text-white/60">{category.closing}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Rich account-type comparison — each type gets its own card with two
 *  separately labeled bullet lists (e.g. Alibaba Cloud's Personal account
 *  "Includes" + "Verification Details" vs Business account "Includes" +
 *  "Enterprise Verification Advantages"). */
export function ProviderAccountTypeDetails({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["accountTypeDetails"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {content.types.map((type) => (
          <div key={type.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <span className="icon-tile icon-tile-a h-11 w-11">
                <type.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-lg font-bold text-white">{type.title}</p>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{type.listALabel}</p>
              <ul className="mt-3 space-y-2">
                {type.listA.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{type.listBLabel}</p>
              <ul className="mt-3 space-y-2">
                {type.listB.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Standalone full-width service/feature grid — compact cards, no split
 *  layout (e.g. Linode's "What You Can Access With a Linode Account"). */
export function ProviderServiceGrid({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["serviceGrid"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item) => (
          <IconCard key={item.title} item={item} iconTile="icon-tile-b" />
        ))}
      </div>
      {content.closing && <LandingClosing text={content.closing} />}
    </section>
  );
}

/** Big single-stat highlight (e.g. Linode's "$100 Promotional Credit") —
 *  used when a provider has exactly one credit/promo tier rather than a
 *  multi-tier list. */
export function ProviderCreditHighlight({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["creditHighlight"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-accent-blue/10 via-white/[0.03] to-transparent p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="text-5xl font-extrabold tracking-tight text-gradient-premium sm:text-6xl">{content.stat}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-sky-accent">{content.statLabel}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {content.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{content.heading}</h2>
          <div className="mt-3 space-y-3">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-white/70">
                {paragraph}
              </p>
            ))}
          </div>
          {content.closing && <p className="mt-3 text-sm leading-relaxed text-white/60">{content.closing}</p>}
        </div>
      </div>
    </section>
  );
}

/** Row of equally-weighted big-number stats, with an optional secondary
 *  bullet list below (e.g. IBM Cloud's Free Tier: 40+/​$200/​50+/​30 Days,
 *  followed by the specific always-free product list). Distinct from
 *  ProviderCreditHighlight, which spotlights one dominant stat. */
export function ProviderStatGrid({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["statGrid"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {content.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
            <p className="text-3xl font-extrabold tracking-tight text-gradient-premium sm:text-4xl">{stat.value}</p>
            <p className="mt-1.5 text-xs font-medium leading-snug text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
      {content.secondaryList && content.secondaryList.length > 0 && (
        <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {content.secondaryLabel && (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.secondaryLabel}</p>
          )}
          <ul className="mt-3 space-y-2.5">
            {content.secondaryList.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {content.steps && content.steps.length > 0 && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {content.stepsLabel && (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.stepsLabel}</p>
          )}
          <ol className="mt-3 space-y-2.5">
            {content.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-white/75">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
      {content.closing && <LandingClosing text={content.closing} />}
    </section>
  );
}

/** Generic two-column table — used for both "Common Problems" (Issue /
 *  Impact) and "How to Check Legitimacy" (Check / What to Look For), so the
 *  same responsive table styling (stacked rows on mobile) never drifts
 *  between the two. */
export function ProviderTwoColumnTable({
  id,
  heading,
  intro,
  columnA,
  columnB,
  rows,
  extraParagraph,
  closing,
}: {
  id?: string;
  heading: string;
  intro?: string;
  columnA: string;
  columnB: string;
  rows: { a: string; b: string }[];
  extraParagraph?: string;
  closing?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={heading} intro={intro} />
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="hidden border-b border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white/50 sm:flex sm:items-center sm:gap-4">
          <span className="flex-1">{columnA}</span>
          <span className="flex-1">{columnB}</span>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map((row) => (
            <div key={row.a} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <p className="flex-1 text-sm font-semibold text-white">{row.a}</p>
              <p className="flex-1 text-sm leading-relaxed text-white/60">{row.b}</p>
            </div>
          ))}
        </div>
      </div>
      {extraParagraph && <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70">{extraParagraph}</p>}
      {closing && <LandingClosing text={closing} />}
    </section>
  );
}

/** Mirrored before/after comparison (e.g. "How Pre-Verified Accounts Solve
 *  These Issues") — reuses the exact issue labels already introduced by the
 *  Common Problems table rather than inventing new "before" copy. */
export function ProviderBeforeAfterSection({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["solvedIssues"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{content.beforeLabel}</p>
          <ul className="mt-4 space-y-3">
            {content.beforeItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/60">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400/70" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{content.afterLabel}</p>
          <ul className="mt-4 space-y-3">
            {content.afterItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {content.middleParagraph && <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70">{content.middleParagraph}</p>}
      {content.closing && <LandingClosing text={content.closing} />}
    </section>
  );
}

/** Two-column "what makes it safe" vs "unverified-seller risks"
 *  comparison. */
export function ProviderSafeVsRiskSection({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["safety"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{content.heading}</h2>
        {content.shortAnswer && <p className="mt-3 text-base font-semibold text-white">{content.shortAnswer}</p>}
        <p className="mt-2 text-base leading-relaxed text-white/70">{content.longAnswer}</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{content.safeLabel}</p>
          <ul className="mt-4 space-y-3">
            {content.safeItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-300">{content.riskLabel}</p>
          <ul className="mt-4 space-y-3">
            {content.riskItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400/80" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <LandingClosing text={content.closing} />
    </section>
  );
}

/** Compact icon-row checklist (e.g. "Best Practices After You Buy Google
 *  Cloud Account") — rows, not grid cards, per spec. */
export function ProviderChecklistSection({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["bestPractices"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 max-w-3xl divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {content.items.map((item) => (
          <div key={item.title} className="flex items-start gap-4 p-4 sm:p-5">
            <span className="icon-tile icon-tile-a h-10 w-10 shrink-0">
              <item.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Two-column "production uses" + "reliability checklist", with a closing
 *  warning callout. */
export function ProviderProductionUseSection({
  id,
  content,
}: {
  id: string;
  content: NonNullable<ProviderLandingContent["productionUse"]>;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <LandingSectionHeader heading={content.heading} intro={content.intro} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.usesLabel}</p>
          <ul className="mt-4 space-y-2.5">
            {content.uses.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-accent">{content.reliabilityLabel}</p>
          <ul className="mt-4 space-y-2.5">
            {content.reliability.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex max-w-3xl items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {content.warning}
      </div>
    </section>
  );
}
