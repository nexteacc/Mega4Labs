import type { Locale } from "@/lib/i18n";
import { CTAButton } from "@/components/CTAButton";

type IntermediateCTAProps = {
  copy: string;
  locale: Locale;
  ctaLabel: string;
};

export function IntermediateCTA({ copy, locale, ctaLabel }: IntermediateCTAProps) {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-8 lg:px-10">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-panel via-panel to-highlight px-6 py-8 shadow-[0_24px_70px_rgba(17,24,39,0.12)] sm:rounded-[36px] sm:px-12 sm:py-10 lg:px-16">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-40 w-40 rounded-full bg-cta/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="max-w-2xl text-base font-medium text-primary break-words sm:text-lg lg:text-xl">
            {copy}
          </p>
          <CTAButton locale={locale} location="module">
            {ctaLabel}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}