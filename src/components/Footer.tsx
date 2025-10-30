import type { Locale } from "@/lib/i18n";
import {
  FOOTER_MADE_WITH_LOVE,
  FOOTER_BLOG,
  FOOTER_SUBMIT_VIDEO,
  FOOTER_COPYRIGHT,
} from "@/lib/i18n";
import Link from "next/link";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="relative mt-12 flex min-h-[20rem] flex-col justify-end overflow-hidden bg-base px-4 pb-12 pt-8 sm:mt-16 sm:min-h-[24rem] sm:px-6 sm:pb-16 lg:mt-24 lg:min-h-[32rem] lg:px-10">
      {/* 背景图案 - C 左侧 */}
      <div
        className="absolute left-4 top-0 z-0 h-full w-1/4 sm:left-12 lg:left-24"
        style={{
          backgroundImage: "url(/C.svg)",
          backgroundSize: "50%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left 30%",
        }}
      />

      {/* 背景图案 - × 居中 */}
      <div
        className="absolute left-1/2 top-0 z-0 h-full w-1/4 -translate-x-1/2"
        style={{
          backgroundImage: "url(/x.svg)",
          backgroundSize: "50%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 30%",
        }}
      />

      {/* 背景图案 - P 右侧 */}
      <div
        className="absolute right-4 top-0 z-0 h-full w-1/4 sm:right-12 lg:right-24"
        style={{
          backgroundImage: "url(/P.svg)",
          backgroundSize: "50%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 30%",
        }}
      />

      {/* 内容区域 - 最上层 */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        {/* 链接 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-center text-xs sm:mb-8 sm:gap-3 sm:text-sm lg:text-base">
          <span className="font-medium text-gray-900 break-words">
            {FOOTER_MADE_WITH_LOVE[locale]}
          </span>
          <span className="text-gray-400">•</span>
          <Link
            href={`/${locale}/blog`}
            className="font-medium !text-gray-700 transition-colors hover:!text-[#21808d]"
          >
            {FOOTER_BLOG[locale]}
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            href="https://tally.so/r/mOp4Ep"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium !text-gray-700 transition-colors hover:!text-[#21808d]"
          >
            {FOOTER_SUBMIT_VIDEO[locale]}
          </Link>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-[10px] text-gray-600 break-words sm:text-xs lg:text-sm">
          {FOOTER_COPYRIGHT[locale]}
        </div>
      </div>
    </footer>
  );
}
