/**
 * Homepage-specific disclaimer, placed just above the Footer. Deliberately a
 * separate static block rather than reading site_settings.disclaimer — that
 * field already serves the dedicated /disclaimer legal page with its own
 * wording, and this is the exact disclaimer text required on the Homepage
 * itself, so this keeps the two independent rather than overwriting a field
 * another page depends on.
 */
export function HomepageDisclaimer() {
  return (
    <section className="border-t border-line bg-bg-subtle py-8">
      <div className="container-page">
        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink-muted">Disclaimer:</strong> Go Cloud Shop is an independent
          marketplace. We are not affiliated with, endorsed by, or sponsored by Amazon Web Services, Google Cloud,
          Microsoft Azure, or any other cloud provider mentioned on this site. All product names, logos, and brands
          are the property of their respective owners. Our accounts are sourced through legitimate channels and
          verified before delivery.
        </p>
      </div>
    </section>
  );
}
