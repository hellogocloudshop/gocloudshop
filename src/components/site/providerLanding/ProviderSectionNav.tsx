/**
 * Slim sticky quick-nav for long provider landing pages — pure anchor links,
 * no client JS/scroll-spy required. Sits just below the site header (which
 * is sticky top-0 h-16). Only rendered when a provider has landing content.
 */
export function ProviderSectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-30 -mx-4 overflow-x-auto border-b border-white/10 bg-[#0b1220]/90 px-4 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-2"
    >
      <ul className="flex min-w-max items-center gap-1 py-2.5 sm:min-w-0 sm:flex-wrap">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
