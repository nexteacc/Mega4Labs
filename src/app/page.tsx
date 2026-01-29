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

type Props = {
  params: Record<string, string | string[] | undefined>;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // Await searchParams in case it's a promise (Next.js 15+ compatible)
  const sp = await Promise.resolve(searchParams);
  const videoId = sp?.video;
  
  const defaultMetadata: Metadata = {
    title: `${SITE_NAME} - Interviews & Insights from AI Industry Sailors`,
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
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SEO_DESCRIPTION,
    },
  };

  if (typeof videoId === "string") {
    const allVideos = getAllVideos();
    const video = allVideos.find((v) => v.id === videoId);

    if (video) {
      const videoMetadata: Metadata = {
        ...defaultMetadata,
        title: `${video.title} | ${SITE_NAME}`,
        description: video.description || SEO_DESCRIPTION,
        openGraph: {
          ...defaultMetadata.openGraph,
          title: video.title,
          description: video.description || SEO_DESCRIPTION,
          images: [
            {
              url: video.thumbnail.url,
              width: video.thumbnail.width,
              height: video.thumbnail.height,
              alt: video.title,
            },
          ],
        },
        twitter: {
          ...defaultMetadata.twitter,
          title: video.title,
          description: video.description || SEO_DESCRIPTION,
          images: [video.thumbnail.url],
        },
      };
      return videoMetadata;
    }
  }

  return defaultMetadata;
}

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
    description: SEO_DESCRIPTION,
  });

  const organizationJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
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
