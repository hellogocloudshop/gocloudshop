import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gocloudshop.com";
  const dark = tone === "dark";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className={cn("flex flex-wrap items-center gap-1.5", dark ? "text-white/60" : "text-ink-muted")}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            {item.href && index !== items.length - 1 ? (
              <Link href={item.href} className={cn("transition-colors", dark ? "hover:text-sky-accent" : "hover:text-accent-blue")}>
                {item.label}
              </Link>
            ) : (
              <span className={dark ? "text-white" : "text-ink"} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
