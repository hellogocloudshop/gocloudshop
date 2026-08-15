import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("section-eyebrow", tone === "dark" && "text-sky-accent")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "mt-2 text-2xl font-bold tracking-tight sm:text-3xl",
          tone === "dark" ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-base", tone === "dark" ? "text-white/70" : "text-ink-muted")}>{subtitle}</p>
      )}
    </div>
  );
}
