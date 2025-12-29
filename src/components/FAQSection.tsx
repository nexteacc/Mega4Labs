"use client";

import { useState } from "react";
import { FAQ_DATA } from "@/data/faq";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 break-words sm:mb-4">
            {FAQ_DATA.title}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto break-words sm:text-lg">
            {FAQ_DATA.description}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQ_DATA.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Question button */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors rounded-lg sm:px-6 sm:py-4 sm:gap-4"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-gray-900 flex-1 break-words sm:text-lg">
                  {item.question}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 sm:w-5 sm:h-5 ${
                    openIndex === index ? "rotate-180" : ""
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

              {/* Answer content */}
              {openIndex === index && (
                <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <div
                    className="prose prose-gray max-w-none text-sm text-gray-700 leading-relaxed break-words sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: formatAnswer(item.answer),
                    }}
                  />
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
 * Format answer text with basic markdown support
 */
function formatAnswer(text: string): string {
  let html = text;

  // Handle bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Handle list items
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(
    /(<li>.*<\/li>\n?)+/g,
    "<ul class='list-disc list-inside space-y-1 my-3'>$&</ul>"
  );

  // Handle paragraphs
  html = html.replace(/\n\n/g, "</p><p class='mt-4'>");
  html = `<p>${html}</p>`;

  return html;
}
