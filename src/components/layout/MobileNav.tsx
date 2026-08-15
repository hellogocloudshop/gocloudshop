"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "@/components/contact/ContactLinks";
import { Logo } from "@/components/ui/Logo";
import { MAIN_NAV } from "@/config/nav";
import { SearchBox } from "./SearchBox";

export function MobileNav({
  open,
  onClose,
  siteName,
  channels,
}: {
  open: boolean;
  onClose: () => void;
  siteName: string;
  channels: ContactChannels;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
      {/*
        Near-opaque scrim (not just a light tint) so the header behind —
        which has its own logo, currency selector, contact icons and cart —
        is fully hidden while the drawer is open, rather than dimly visible
        underneath and reading as a duplicate of what's in the drawer.
      */}
      <div className="absolute inset-0 bg-primary-dark/90 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-surface p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} aria-label={`${siteName} home`}>
            <Logo siteName={siteName} size="sm" showTagline={false} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-subtle"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5">
          <SearchBox />
        </div>

        <nav className="mt-5" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-bg-subtle"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 border-t border-line pt-5">
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Contact Us</p>
          <ContactLinks channels={channels} variant="list" onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
