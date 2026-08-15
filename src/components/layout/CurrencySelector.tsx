"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visual country/currency indicator only — GoCloudShop's entire catalog is
 * priced in USD (see products.currency in the schema) and there is no
 * multi-currency conversion system to connect to. Rather than faking a
 * currency switcher, this shows the one real currency the storefront uses
 * and says so plainly in the dropdown, so nothing here claims functionality
 * that doesn't exist. If a real conversion system is added later, this is
 * the single place to wire it up.
 */
export function CurrencySelector() {
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Select currency"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all duration-200 sm:px-3",
          open
            ? "border-accent-blue/40 bg-white/[0.06] text-ink"
            : "border-line bg-white/[0.03] text-ink-muted hover:border-white/20 hover:bg-white/[0.06] hover:text-ink"
        )}
      >
        {/* Plain <img>, not next/image — local SVGs are blocked by Next's
            built-in raster optimizer by default, and a vector icon this
            small gets no benefit from it anyway. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/us-flag.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px] shrink-0 rounded-full object-contain" />
        <span>US</span>
        <span aria-hidden="true" className="hidden h-3 w-px bg-line sm:block" />
        <span className="hidden sm:inline">USD</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 animate-fade-in">
          <div className="card-surface p-3 text-xs shadow-[var(--shadow-elevated)]">
            <p className="font-semibold text-ink">United States — USD</p>
            <p className="mt-1 leading-relaxed text-ink-muted">All prices on GoCloudShop are listed in US Dollars.</p>
          </div>
        </div>
      )}
    </div>
  );
}
