import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { getAllPersonSlugs } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/people`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Add all person pages
  const personSlugs = getAllPersonSlugs();
  const personPages: MetadataRoute.Sitemap = personSlugs.map((slug) => ({
    url: `${BASE_URL}/people/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...routes, ...personPages];
}
