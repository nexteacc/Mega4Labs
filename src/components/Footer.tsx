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
    <footer className="relative mt-16 flex min-h-[24rem] flex-col justify-end overflow-hidden bg-base px-6 pb-16 pt-8 sm:mt-20 sm:min-h-[28rem] sm:px-8 lg:mt-24 lg:min-h-[32rem] lg:px-10">
      {/* 背景图案 - C 左侧 */}
      <div
        className="absolute left-12 top-0 z-0 h-full w-1/4 sm:left-16 lg:left-24"
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
        className="absolute right-12 top-0 z-0 h-full w-1/4 sm:right-16 lg:right-24"
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
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-center text-sm sm:gap-3 sm:text-base">
          <span className="font-medium text-gray-900">
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
        <div className="text-center text-xs text-gray-600 sm:text-sm">
          {FOOTER_COPYRIGHT[locale]}
        </div>
      </div>
    </footer>
  );
}
