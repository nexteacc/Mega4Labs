"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { FAQ_DATA } from "@/data/faq";

type FAQSectionProps = {
  locale: Locale;
};

export function FAQSection({ locale }: FAQSectionProps) {
  const faqData = FAQ_DATA[locale];
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 默认展开第一个

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 break-words sm:mb-4">
            {faqData.title}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto break-words sm:text-lg">
            {faqData.description}
          </p>
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-4">
          {faqData.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 问题按钮 */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors rounded-lg sm:px-6 sm:py-4 sm:gap-4"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-gray-900 flex-1 break-words sm:text-lg">
                  {item.question}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 sm:w-5 sm:h-5 ${openIndex === index ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 答案内容 */}
              {openIndex === index && (
                <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <div
                    className="prose prose-gray max-w-none text-sm text-gray-700 leading-relaxed break-words sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: formatAnswer(item.answer, item.references),
                    }}
                  />

                  {/* 引用来源 */}
                  {item.references && item.references.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        References:
                      </p>
                      <div className="space-y-1">
                        {item.references.map((ref) => (
                          <div key={ref.number} id={`ref-${ref.number}`} className="text-sm">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="faq-reference-link hover:underline"
                            >
                              <span className="font-semibold">[{ref.number}]</span> {getDomain(ref.url)}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 格式化答案文本
 * 支持 Markdown 基本语法：**粗体**、表格、列表、上标引用
 */
function formatAnswer(text: string, references?: Array<{ number: number; url: string }>): string {
  let html = text;

  // 处理上标引用 [^1] -> 可点击的上标
  if (references) {
    html = html.replace(/\[\^(\d+)\]/g, (_match, num) => {
      const ref = references.find(r => r.number === parseInt(num));
      if (ref) {
        return `<sup><a href="#ref-${num}" style="color: #21808d; text-decoration: none; font-weight: 500;">[${num}]</a></sup>`;
      }
      return _match;
    });
  }

  // 处理粗体 **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 处理表格（简单的 Markdown 表格）
  if (html.includes("|")) {
    html = html.replace(
      /\n\n(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g,
      (_match, header, _separator, rows) => {
        const headerCells = header
          .split("|")
          .filter((c: string) => c.trim())
          .map((c: string) => `<th class="px-4 py-2 text-left">${c.trim()}</th>`)
          .join("");

        const rowsHtml = rows
          .trim()
          .split("\n")
          .map((row: string) => {
            const cells = row
              .split("|")
              .filter((c: string) => c.trim())
              .map((c: string) => `<td class="px-4 py-2 border-t">${c.trim()}</td>`)
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");

        return `<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg"><thead class="bg-gray-50"><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
      }
    );
  }

  // 处理列表项 - 开头的
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul class='list-disc list-inside space-y-1 my-3'>$&</ul>");

  // 处理段落
  html = html.replace(/\n\n/g, "</p><p class='mt-4'>");
  html = `<p>${html}</p>`;

  return html;
}

/**
 * 从 URL 提取域名
 */
function getDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return url;
  }
}
