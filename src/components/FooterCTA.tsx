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
    <section className="mx-auto w-full max-w-[1180px] px-4 pb-[var(--spacing-section)] sm:px-8 lg:px-10">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-accent via-accent-strong to-[#144b53] px-6 py-10 shadow-[0_30px_80px_rgba(3,94,106,0.35)] sm:rounded-[42px] sm:px-16 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_60%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-2 text-left sm:space-y-3">
            <h3 className="text-2xl font-semibold leading-tight text-white break-words sm:text-3xl lg:text-4xl">
              {headline}
            </h3>
            <p className="text-sm leading-relaxed !text-white break-words sm:text-base lg:text-lg">
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