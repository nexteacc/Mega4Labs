import { Github } from "@lobehub/icons";
import {
  FOOTER_MADE_WITH_LOVE,
  FOOTER_COPYRIGHT,
} from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="mt-12 bg-base px-4 py-8 sm:mt-16 sm:px-6 sm:py-12 lg:mt-24 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* 链接 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-center text-xs sm:mb-8 sm:gap-3 sm:text-sm lg:text-base">
          <span className="font-medium text-gray-900 break-words">
            {FOOTER_MADE_WITH_LOVE}
          </span>
          <span className="text-gray-400">•</span>
          <a
            href="https://github.com/nexteacc/Mega4Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            <Github size={20} style={{ color: '#111827' }} />
            <span>GitHub</span>
          </a>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-[10px] text-gray-600 break-words sm:text-xs lg:text-sm">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
