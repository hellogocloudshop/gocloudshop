import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn("btn-secondary", page <= 1 && "pointer-events-none opacity-40")}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
      </Link>
      <span className="px-3 text-sm text-ink-muted">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn("btn-secondary", page >= totalPages && "pointer-events-none opacity-40")}
      >
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
