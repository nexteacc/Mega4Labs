"use client";

import { useState } from "react";
import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";
import { AI_LEADERS } from "@/config/video-search";
import { generateSlug } from "@/lib/slug";
import { getPersonCount } from "@/lib/content";
import type { Company } from "@/lib/types";
import Link from "next/link";

const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
} as const;

const COMPANIES: Company[] = ["openai", "cursor", "google", "anthropic"];

export function Navigation() {
  const [activeMenu, setActiveMenu] = useState<Company | null>(null);
  const personCount = getPersonCount();

  const handleCompanyClick = (company: Company) => {
    // Scroll to company section
    const element = document.getElementById(company);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveMenu(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* People Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/people"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:px-4"
            >
              People
            </Link>
            
            <div className="hidden text-xs text-gray-500 sm:block border-l border-gray-200 pl-4">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Weekly Updates</span>
              </div>
              <div className="mt-0.5 font-medium">
                Tracking {personCount} AI Sailors
              </div>
            </div>
          </div>

          {/* Company Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
          {COMPANIES.map((company) => {
            const config = AI_LEADERS[company];
            const LogoComponent = COMPANY_LOGOS[company];
            const isActive = activeMenu === company;

            return (
              <div
                key={company}
                className="relative"
                onMouseEnter={() => setActiveMenu(company)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {/* Company Button */}
                <button
                  onClick={() => handleCompanyClick(company)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 sm:gap-3 sm:px-4"
                >
                  <LogoComponent size={24} className="flex-shrink-0" />
                  <span className="hidden text-sm font-medium text-gray-900 sm:inline">
                    {config.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isActive && (
                  <div className="absolute left-0 top-full pt-1 min-w-[200px]">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
                      <div className="p-2">
                        <div className="mb-2 px-3 py-1 text-xs font-semibold text-gray-500">
                          {config.name}
                        </div>
                        {config.people.map((person: { name: string; role: string }) => (
                          <Link
                            key={person.name}
                            href={`/people/${generateSlug(person.name)}`}
                            onClick={() => setActiveMenu(null)}
                            className="block w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {person.role}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>

          {/* Spacer for balance */}
          <div className="w-[60px] sm:w-[80px]" />
        </div>
      </div>
    </nav>
  );
}
