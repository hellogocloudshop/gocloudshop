"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "./ContactLinks";

/**
 * ONE persistent floating contact button (not three) — expands into the
 * configured channel list on click. Fixed to the bottom-right corner with
 * enough offset to stay clear of page content; sits below the mobile nav
 * drawer's z-index (50) so the drawer always takes priority when open.
 */
export function FloatingContactButton({ channels }: { channels: ContactChannels }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed right-4 z-40 sm:right-6"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-64 animate-fade-in">
          <div className="card-surface p-3 shadow-[var(--shadow-elevated)]">
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Contact Us</p>
            <ContactLinks channels={channels} variant="list" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "Contact us"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-secondary text-white shadow-[var(--shadow-glow-blue)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
}
