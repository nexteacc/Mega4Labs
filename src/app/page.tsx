import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { CompanySection } from "@/components/CompanySection";
import { FAQSection } from "@/components/FAQSection";
import {
  SITE_NAME,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  buildHeroSupporting,
} from "@/lib/i18n";
import {
  getAllVideos,
  getHeroVideos,
  getVideoModules,
  getVideoCount,
} from "@/lib/content";

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = {
  title: `${SITE_NAME} - Interviews & Insights from AI Industry Leaders`,
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
  openGraph: {
    title: SITE_NAME,
    description: SEO_DESCRIPTION,
    url: "https://mega4lab.com",
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "https://mega4lab.com/opengraph-image.png",
        width: 1200,
        height: 628,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SEO_DESCRIPTION,
    images: ["https://mega4lab.com/twitter-image.png"],
  },
};

export default function HomePage() {
  const videoCount = getVideoCount();
  const heroSupporting = buildHeroSupporting(videoCount);
  const heroVideos = getHeroVideos();
  const modules = getVideoModules();
  const allVideos = getAllVideos();

  // Build JSON-LD structured data
  const websiteJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: "https://mega4lab.com",
    description: SEO_DESCRIPTION,
  });

  const organizationJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: "https://mega4lab.com",
  });

  const itemListJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allVideos.slice(0, 10).map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail.url,
        uploadDate: video.publishDate,
        contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
      },
    })),
  });

  return (
    <>
      <HeroSection videos={heroVideos} heroSupporting={heroSupporting} />

      {modules.map((module) => (
        <CompanySection
          key={module.company}
          company={module.company}
          displayName={module.displayName}
          description={module.description}
          videos={module.videos}
        />
      ))}

      <FAQSection />

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
