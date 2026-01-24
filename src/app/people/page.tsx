import type { Metadata } from "next";
import { AI_LEADERS } from "@/config/video-search";
import { generateSlug } from "@/lib/slug";
import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";
import Link from "next/link";
import type { Company } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI Sailors",
  description: "Meet the sailors navigating the future of AI - visionaries from OpenAI, Anthropic, Google, and Cursor.",
};

const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
} as const;

const COMPANIES: Company[] = ["openai", "cursor", "google", "anthropic"];

export default function PeoplePage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
          AI Sailors
        </h1>
        <p className="text-lg text-secondary sm:text-xl">
          Meet the sailors navigating the future of AI
        </p>
      </div>

      <div className="space-y-12">
        {COMPANIES.map((company) => {
          const config = AI_LEADERS[company];
          const LogoComponent = COMPANY_LOGOS[company];

          return (
            <section key={company} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <LogoComponent size={40} className="flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
                  {config.name}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {config.people.map((person) => {
                  const slug = generateSlug(person.name);
                  
                  return (
                    <Link
                      key={person.name}
                      href={`/people/${slug}`}
                      className="group rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-md"
                    >
                      <h3 className="mb-1 text-lg font-semibold text-primary group-hover:text-accent">
                        {person.name}
                      </h3>
                      <p className="text-sm text-secondary">{person.role}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
