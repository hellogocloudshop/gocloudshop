import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(variantClass[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ variant = "primary", className, children, href, ...props }: LinkButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a href={href} className={cn(variantClass[variant], className)} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(variantClass[variant], className)} {...props}>
      {children}
    </Link>
  );
}
