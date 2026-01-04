import { AI_LEADERS } from "@/config/video-search";
import type { Company } from "@/lib/types";

/**
 * Generate URL-friendly slug from person name
 */
export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Person data with company information
 */
export type PersonData = {
  name: string;
  role: string;
  company: Company;
  companyConfig: typeof AI_LEADERS[Company];
};

/**
 * Create a map of slug -> person data for fast lookup
 */
export function createPersonSlugMap(): Map<string, PersonData> {
  const map = new Map<string, PersonData>();
  
  for (const [companyKey, config] of Object.entries(AI_LEADERS)) {
    for (const person of config.people) {
      const slug = generateSlug(person.name);
      map.set(slug, {
        ...person,
        company: companyKey as Company,
        companyConfig: config,
      });
    }
  }
  
  return map;
}

/**
 * Find person by slug
 */
export function findPersonBySlug(slug: string): PersonData | null {
  const map = createPersonSlugMap();
  return map.get(slug) || null;
}

/**
 * Get all person slugs for static generation
 */
export function getAllPersonSlugs(): string[] {
  const slugs: string[] = [];
  
  for (const config of Object.values(AI_LEADERS)) {
    for (const person of config.people) {
      slugs.push(generateSlug(person.name));
    }
  }
  
  return slugs;
}
