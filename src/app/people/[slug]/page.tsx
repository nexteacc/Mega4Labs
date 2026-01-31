import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideosByPerson } from "@/lib/content";
import { findPersonBySlug, getAllPersonSlugs } from "@/lib/slug";
import { PersonVideoGrid } from "@/components/PersonVideoGrid";
import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";
import Link from "next/link";
import Image from "next/image";

const A16zLogo = ({ size = 24, className }: { size?: number; className?: string }) => (
  <Image
    src="/a16z.png"
    alt="a16z"
    width={size}
    height={size}
    className={`object-contain ${className || ""}`}
  />
);

const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
  a16z: A16zLogo,
} as const;

// Get all possible slugs for static generation
export function generateStaticParams() {
  return getAllPersonSlugs().map(slug => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const personData = findPersonBySlug(slug);
  
  if (!personData) {
    return {
      title: "Person Not Found",
    };
  }

  return {
    title: `${personData.name} - ${personData.role}`,
    description: `Watch interviews and insights from ${personData.name}, ${personData.role} at ${personData.companyConfig.name}`,
  };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const personData = findPersonBySlug(slug);
  
  if (!personData) {
    notFound();
  }

  // Get videos for this person (optimized)
  const personVideos = getVideosByPerson(personData.name);

  const LogoComponent = COMPANY_LOGOS[personData.company];

  // Structured data for SEO
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personData.name,
    "jobTitle": personData.role,
    "worksFor": {
      "@type": "Organization",
      "name": personData.companyConfig.name
    }
  };

  const videoListJsonLd = personVideos.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": personVideos.slice(0, 10).map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": video.description,
        "thumbnailUrl": video.thumbnail.url,
        "uploadDate": video.publishDate,
        "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
        "embedUrl": `https://www.youtube.com/embed/${video.id}`,
      }
    }))
  } : null;

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-secondary">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/people" className="hover:text-primary">
          People
        </Link>
        <span>/</span>
        <span className="text-primary">{personData.name}</span>
      </nav>

      {/* Person Header */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <LogoComponent size={48} className="flex-shrink-0" />
          <div>
            <h1 className="mb-2 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              {personData.name}
            </h1>
            <p className="text-lg text-secondary sm:text-xl">
              {personData.role} at {personData.companyConfig.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-secondary">
          <span>{personVideos.length} videos</span>
        </div>
      </div>

      {/* Videos Grid */}
      {personVideos.length > 0 ? (
        <PersonVideoGrid videos={personVideos} />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-secondary">
            No videos found for {personData.name} yet.
          </p>
        </div>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {videoListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListJsonLd) }}
        />
      )}
    </div>
  );
}
