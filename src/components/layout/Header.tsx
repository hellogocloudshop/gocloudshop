"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV, NAV_ACCENTS } from "@/config/nav";
import type { ContactChannels } from "@/lib/contact";
import { Logo } from "@/components/ui/Logo";
import { ContactMenu } from "@/components/contact/ContactMenu";
import { ContactBar } from "@/components/contact/ContactBar";
import { CurrencySelector } from "./CurrencySelector";
import { CartButton } from "./CartButton";
import { SearchBox } from "./SearchBox";
import { MobileNav } from "./MobileNav";

export function Header({ siteName, channels }: { siteName: string; channels: ContactChannels }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300",
        scrolled ? "border-line bg-surface/95 shadow-[0_1px_0_0_rgb(0_0_0_/_0.3)]" : "border-white/5 bg-surface/80"
      )}
    >
      {/* Faint atmospheric cyan/blue wash across the top of the header —
          layered-glass feel without brightening the header itself. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_100%_at_20%_0%,rgb(56_189_248_/_0.06),transparent_60%)]"
        aria-hidden="true"
      />

      {/* Utility bar: logo, search, currency, contact, cart */}
      <div className="container-page relative flex h-16 items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${siteName} home`}>
          <Logo siteName={siteName} tagline="Cloud Access, Simplified." />
        </Link>

        <SearchBox className="hidden max-w-md flex-1 xl:block" placeholder="Search for accounts, credits, AI & more…" />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <CurrencySelector />
          <ContactBar channels={channels} />
          <ContactMenu channels={channels} />
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-width search row — shown below xl, where there's no room for
          an inline search bar in the utility row above. */}
      <div className="border-t border-line px-4 py-3 xl:hidden">
        <SearchBox placeholder="Search for accounts, credits, AI & more…" />
      </div>

      {/* Second row: premium nav bar */}
      <nav className="hidden border-t border-white/5 bg-black/10 lg:block" aria-label="Main">
        <div className="container-page flex h-12 items-center gap-1.5">
          {MAIN_NAV.map((item) => {
            const active = pathname === item.href;
            // Cloud Service / Stock Updates keep a permanent brand-color
            // tint (see NAV_ACCENTS) — every other item keeps the plain
            // neutral treatment unchanged.
            const accent = NAV_ACCENTS[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-12 items-center rounded-t-md px-4 text-sm font-medium transition-colors",
                  accent
                    ? cn(accent.text, accent.hoverBg, "hover:brightness-125")
                    : active
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 bottom-0 h-0.5 rounded-full transition-all duration-300",
                    accent ? accent.underline : "bg-gradient-to-r from-accent-blue to-sky-accent",
                    active ? cn("opacity-100", accent?.glow) : "opacity-0"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </nav>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} siteName={siteName} channels={channels} />
    </header>
  );
}
