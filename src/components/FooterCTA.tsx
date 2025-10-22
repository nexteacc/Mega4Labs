import type { Locale } from "@/lib/i18n";
import { CTAButton } from "@/components/CTAButton";

type FooterCTAProps = {
  headline: string;
  subhead: string;
  ctaLabel: string;
  locale: Locale;
};

export function FooterCTA({ headline, subhead, ctaLabel, locale }: FooterCTAProps) {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 pb-[var(--spacing-section)] sm:px-8 lg:px-10">
      <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-r from-accent via-accent-strong to-[#144b53] px-10 py-12 shadow-[0_30px_80px_rgba(3,94,106,0.35)] sm:px-16 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_60%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 text-left">
            <h3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {headline}
            </h3>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              {subhead}
            </p>
          </div>
          <CTAButton locale={locale} location="footer">
            {ctaLabel}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}