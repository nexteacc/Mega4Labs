import {
  FOOTER_MADE_WITH_LOVE,
  FOOTER_SUBMIT_VIDEO,
  FOOTER_COPYRIGHT,
} from "@/lib/i18n";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-12 flex min-h-[16rem] flex-col justify-end overflow-hidden bg-base px-4 pb-12 pt-8 sm:mt-16 sm:min-h-[20rem] sm:px-6 sm:pb-16 lg:mt-24 lg:min-h-[24rem] lg:px-10">
      {/* 内容区域 */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        {/* 链接 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-center text-xs sm:mb-8 sm:gap-3 sm:text-sm lg:text-base">
          <span className="font-medium text-gray-900 break-words">
            {FOOTER_MADE_WITH_LOVE}
          </span>
          <span className="text-gray-400">•</span>
          <Link
            href="https://tally.so/r/mOp4Ep"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium !text-gray-700 transition-colors hover:!text-[#21808d]"
          >
            {FOOTER_SUBMIT_VIDEO}
          </Link>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-[10px] text-gray-600 break-words sm:text-xs lg:text-sm">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
