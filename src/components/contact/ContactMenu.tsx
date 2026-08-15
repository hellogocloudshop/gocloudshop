"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactChannels } from "@/lib/contact";
import { ContactLinks } from "./ContactLinks";

/** Compact "Contact" dropdown trigger — collapses Telegram/WhatsApp/Telegram
 *  Channel into one control. Used below the `lg` breakpoint, where the
 *  Header's full "Contact Us" + inline icon row (see ContactBar) doesn't
 *  fit; on `lg` and up the Header renders ContactBar instead. */
export function ContactMenu({ channels }: { channels: ContactChannels }) {
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
    <div ref={ref} className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Contact Us"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition-colors",
          open ? "bg-white/[0.06] text-ink" : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
        )}
      >
        <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-fade-in">
          <div className="card-surface p-3 shadow-[var(--shadow-elevated)]">
            <ContactLinks channels={channels} variant="list" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
