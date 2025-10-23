import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { IntermediateCTA } from "@/components/IntermediateCTA";
import { FooterCTA } from "@/components/FooterCTA";
import { VideoModuleSection } from "@/components/VideoModuleSection";
import {
  CTA_LABELS,
  FOOTER_CTA_LABEL,
  INTERMEDIATE_CTA,
  BOTTOM_CTA_HEADLINE,
  BOTTOM_CTA_SUBHEAD,
  resolveLocale,
} from "@/lib/i18n";
import {
  buildAlternates,
  buildKeywords,
  buildOpenGraph,
  buildOrganizationJsonLd,
  buildPageDescription,
  buildPageTitle,
  buildVideoItemListJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import {
  getAllVideosForLocale,
  getHeroVideos,
  getVideoModules,
} from "@/lib/content";
import type { VideoModule } from "@/lib/types";

type LocalePageProps = Readonly<{
  params: Promise<{ locale?: string }>;
}>;

const mapModules = (modules: VideoModule[]) =>
  modules.map((module) => {
    const isShorts = module.category === "shorts";
    const columns = isShorts
      ? { base: 1 as const, md: 2 as const, lg: 4 as const }
      : { base: 1 as const, md: 2 as const, lg: 3 as const };

    return {
      ...module,
      settings: {
        cardVariant: isShorts ? ("short" as const) : ("default" as const),
        columns,
      },
    };
  });

export const revalidate = 21600; // 6 hours

export async function generateMetadata(
  { params }: LocalePageProps,
): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  return {
    title: buildPageTitle(locale),
    description: buildPageDescription(locale),
    keywords: buildKeywords(locale),
    authors: [{ name: "Perplexity Pro" }],
    creator: "Perplexity Pro",
    publisher: "Perplexity Pro",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: buildAlternates(locale),
    openGraph: buildOpenGraph(locale),
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroVideos = getHeroVideos(locale);
  const modules = mapModules(getVideoModules(locale));
  const allVideos = getAllVideosForLocale(locale);
  const itemListJsonLd = buildVideoItemListJsonLd(locale, allVideos);
  const websiteJsonLd = buildWebsiteJsonLd(locale);
  const organizationJsonLd = buildOrganizationJsonLd();

  const tutorialModule = modules.find((module) => module.category === "tutorial");
  const proReviewModule = modules.find((module) => module.category === "proReview");
  const shortsModule = modules.find((module) => module.category === "shorts");

  return (
    <>
      <HeroSection videos={heroVideos} locale={locale} />

      {tutorialModule && (
        <VideoModuleSection
          key={tutorialModule.category}
          title={tutorialModule.title}
          description={tutorialModule.description}
          videos={tutorialModule.videos}
          locale={locale}
          ctaLabel={CTA_LABELS[locale]}
          cardVariant={tutorialModule.settings.cardVariant}
          columns={tutorialModule.settings.columns}
        />
      )}

      <IntermediateCTA
        copy={INTERMEDIATE_CTA[locale]}
        ctaLabel={CTA_LABELS[locale]}
        locale={locale}
      />

      {proReviewModule && (
        <VideoModuleSection
          key={proReviewModule.category}
          title={proReviewModule.title}
          description={proReviewModule.description}
          videos={proReviewModule.videos}
          locale={locale}
          ctaLabel={CTA_LABELS[locale]}
          cardVariant={proReviewModule.settings.cardVariant}
          columns={proReviewModule.settings.columns}
        />
      )}

      {shortsModule && (
        <VideoModuleSection
          key={shortsModule.category}
          title={shortsModule.title}
          description={shortsModule.description}
          videos={shortsModule.videos}
          locale={locale}
          ctaLabel={CTA_LABELS[locale]}
          cardVariant={shortsModule.settings.cardVariant}
          columns={shortsModule.settings.columns}
        />
      )}

      <FooterCTA
        headline={BOTTOM_CTA_HEADLINE[locale]}
        subhead={BOTTOM_CTA_SUBHEAD[locale]}
        ctaLabel={FOOTER_CTA_LABEL[locale]}
        locale={locale}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: itemListJsonLd }}
      />
    </>
  );
}