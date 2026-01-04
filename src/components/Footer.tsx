"use client";

import { Github } from "@lobehub/icons";
import Image from "next/image";
import {
  FOOTER_MADE_WITH_LOVE,
  FOOTER_COPYRIGHT,
} from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Footer() {
  const { track } = useAnalytics();
  return (
    <footer className="mt-12 bg-base px-4 py-8 sm:mt-16 sm:px-6 sm:py-12 lg:mt-24 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* 链接 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center text-xs sm:mb-8 sm:gap-4 sm:text-sm lg:text-base">
          <span className="font-medium text-gray-900 break-words">
            {FOOTER_MADE_WITH_LOVE}
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/nexteacc/Mega4Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-gray-900 hover:text-gray-600 transition-colors"
              onClick={() => track('social_click', { platform: 'github', url: 'https://github.com/nexteacc/Mega4Labs' })}
            >
              <Github size={20} style={{ color: '#111827' }} />
              <span>GitHub</span>
            </a>
            <a
              href="https://x.com/nexteacc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-gray-900 hover:text-gray-600 transition-colors"
              onClick={() => track('social_click', { platform: 'twitter', url: 'https://x.com/nexteacc' })}
            >
              <Image src="/x-logo.svg" alt="X" width={20} height={20} />
              <span>Twitter</span>
            </a>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-[10px] text-gray-600 break-words sm:text-xs lg:text-sm">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
