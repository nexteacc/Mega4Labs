"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { DEFAULT_CTA_URL } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

type CTAButtonVariant = "primary" | "ghost";

interface CTAButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: ReactNode;
  variant?: CTAButtonVariant;
  location: "hero" | "module" | "footer";
  locale: string;
  external?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap";
const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    "bg-cta text-cta-foreground px-5 py-2.5 text-sm shadow-[0_14px_30px_rgba(241,200,75,0.3)] hover:translate-y-[-1px] hover:shadow-[0_20px_40px_rgba(241,200,75,0.35)] active:translate-y-[0px] active:shadow-[0_10px_22px_rgba(241,200,75,0.28)] sm:px-6 sm:py-3 sm:text-base",
  ghost:
    "px-3 py-1.5 text-xs border border-border hover:border-border-strong hover:bg-highlight text-primary sm:px-4 sm:py-2 sm:text-sm",
};

export const CTAButton = ({
  href = DEFAULT_CTA_URL,
  children,
  variant = "primary",
  location,
  locale,
  external = true,
  className,
  onClick,
  target,
  rel,
  ...rest
}: CTAButtonProps) => {
  const { track } = useAnalytics();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    track("cta_click", { location, locale, href });
    onClick?.(event);
  };

  const computedTarget = external ? "_blank" : target;
  const computedRel = external ? "noopener noreferrer" : rel;

  return (
    <a
      href={href}
      onClick={handleClick}
      className={clsx(baseClasses, variantClasses[variant], className)}
      target={computedTarget}
      rel={computedRel}
      {...rest}
    >
      <span className="mr-1.5 sm:mr-2">{children}</span>
      <span aria-hidden className="inline-flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5">
        →
      </span>
    </a>
  );
};