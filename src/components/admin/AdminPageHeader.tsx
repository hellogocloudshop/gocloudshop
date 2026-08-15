import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel = "Add New",
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {newHref && (
        <Link href={newHref} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> {newLabel}
        </Link>
      )}
    </div>
  );
}
