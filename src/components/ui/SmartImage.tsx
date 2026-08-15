import Image from "next/image";
import { PlaceholderLogo, PlaceholderImage } from "./PlaceholderImage";
import { cn } from "@/lib/utils";

/**
 * Renders the real logo/image via next/image when a URL is configured,
 * otherwise falls back to a branded placeholder — never a broken <img>.
 */
export function ProviderLogo({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <span className={cn("relative block overflow-hidden rounded-xl bg-bg-subtle", className)}>
        <Image src={logoUrl} alt={`${name} logo`} fill sizes="80px" className="object-contain p-1" />
      </span>
    );
  }
  return <PlaceholderLogo name={name} className={className} />;
}

export function ProductImage({
  name,
  imageUrl,
  fallbackLabel,
  className,
}: {
  name: string;
  imageUrl?: string | null;
  fallbackLabel?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <span className={cn("relative block overflow-hidden rounded-2xl bg-bg-subtle", className)}>
        <Image src={imageUrl} alt={name} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      </span>
    );
  }
  return <PlaceholderImage className={className} label={fallbackLabel} />;
}
