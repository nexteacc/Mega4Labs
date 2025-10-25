import type { Locale } from "@/lib/i18n";

export type FAQItem = {
    question: string;
    answer: string;
    references?: Array<{
        number: number;
        url: string;
        title?: string;
    }>;
};

export type FAQData = {
    title: string;
    description: string;
    items: FAQItem[];
};

/**
 * FAQ 数据 - 多语言支持
 * 包含 ChatGPT Atlas 相关问答
 */
export const FAQ_DATA: Record<Locale, FAQData> = {
    en: {
        title: "Frequently Asked Questions",
        description: "Compare ChatGPT Atlas and Comet Browser to find the best AI-powered browsing solution for your needs.",
        items: [
            {
                question: "ChatGPT Atlas vs Comet Browser — Which should I choose?",
                answer: `Both **Atlas** (OpenAI) and **Comet** (Perplexity AI) represent a new generation of "agentic browsers," but they emphasize different strengths:[^4][^5][^6]

| Feature | ChatGPT Atlas | Perplexity Comet |
|---------|---------------|------------------|
| Core AI Integration | ChatGPT | Perplexity Search |
| Ideal For | Structured tasks and workflow automation (e.g., research, scheduling) | Real-time information retrieval and exploration |
| OS Support | macOS (Windows/iOS coming soon) | Windows, macOS, web |
| Agent Mode | Available for paid ChatGPT tiers | Built-in for all users |
| Memory System | Optional, user-controlled browser memories | Session-based contextual recall |
| Pricing | Free with premium upgrades | Fully free currently |
| Strength | Tight integration with ChatGPT ecosystem | Seamless search and real-time updates |

Choose **Atlas** if you already rely heavily on ChatGPT for writing, codifying, and planning—its integration is excellent for creation workflows and productivity automation. Choose **Comet** if you prefer fast, source-rich answers, real-time web access, and an exploration-first experience.[^5][^6][^4]`,
                references: [
                    { number: 4, url: "https://www.moneycontrol.com/technology/chatgpt-atlas-vs-perplexity-comet-how-the-two-ai-first-web-browsers-compare-in-terms-of-ai-capabilities-and-agentic-mode-article-13627733.html" },
                    { number: 5, url: "https://news.abplive.com/technology/chatgpt-atlas-vs-perplexity-comet-pricing-availaibility-features-privacy-accuracy-which-one-is-best-comparison-1807404" },
                    { number: 6, url: "https://efficient.app/compare/atlas-vs-comet" },
                ],
            },
            {
                question: "Can I use ChatGPT Atlas with Perplexity AI?",
                answer: `Technically, yes—you can **open Perplexity AI inside Atlas just like any other website**, since Atlas is a Chromium-based browser. However, the integration between them is not native: ChatGPT and Comet run on separate AI ecosystems. This means:[^3][^2]

- You can use **Perplexity AI's website** (www.perplexity.ai) inside Atlas to perform searches.
- But **ChatGPT Atlas's Agent Mode** and **Perplexity's Comet agents** do not interoperate or share context or memory.
- Features like ChatGPT memory, agent automations, and model calls stay within Atlas; Perplexity sessions stay sandboxed in their own site environment.[^2][^3]

In short, you can use them **together** in the same workflow, but not as **interconnected systems**.`,
                references: [
                    { number: 2, url: "https://en.wikipedia.org/wiki/ChatGPT_Atlas" },
                    { number: 3, url: "https://www.extremetech.com/internet/openai-launches-ai-browser-chatgpt-atlas-to-rival-google-chrome-perplexity" },
                ],
            },
        ],
    },
    ko: {
        title: "자주 묻는 질문",
        description: "ChatGPT Atlas와 Comet 브라우저를 비교하여 귀하의 요구에 가장 적합한 AI 기반 브라우징 솔루션을 찾으세요.",
        items: [
            {
                question: "ChatGPT Atlas vs Comet 브라우저 — 어떤 것을 선택해야 하나요?",
                answer: `**Atlas** (OpenAI)와 **Comet** (Perplexity AI) 모두 새로운 세대의 "에이전트 브라우저"를 대표하지만, 서로 다른 강점을 강조합니다.

**Atlas**를 선택하세요: 글쓰기, 코딩, 계획에 ChatGPT를 많이 사용하는 경우 — 창작 워크플로우와 생산성 자동화에 탁월한 통합을 제공합니다.

**Comet**을 선택하세요: 빠르고 소스가 풍부한 답변, 실시간 웹 액세스 및 탐색 우선 경험을 선호하는 경우.`,
                references: [
                    { number: 4, url: "https://www.moneycontrol.com/technology/chatgpt-atlas-vs-perplexity-comet-how-the-two-ai-first-web-browsers-compare-in-terms-of-ai-capabilities-and-agentic-mode-article-13627733.html" },
                    { number: 5, url: "https://news.abplive.com/technology/chatgpt-atlas-vs-perplexity-comet-pricing-availaibility-features-privacy-accuracy-which-one-is-best-comparison-1807404" },
                ],
            },
            {
                question: "ChatGPT Atlas에서 Perplexity AI를 사용할 수 있나요?",
                answer: `기술적으로는 가능합니다 — Atlas는 Chromium 기반 브라우저이므로 다른 웹사이트처럼 Atlas 내에서 Perplexity AI를 열 수 있습니다. 그러나 둘 사이의 통합은 네이티브가 아닙니다: ChatGPT와 Comet은 별도의 AI 생태계에서 실행됩니다.

간단히 말해서, 동일한 워크플로우에서 함께 사용할 수 있지만 **상호 연결된 시스템**으로는 사용할 수 없습니다.`,
                references: [
                    { number: 2, url: "https://en.wikipedia.org/wiki/ChatGPT_Atlas" },
                    { number: 3, url: "https://www.extremetech.com/internet/openai-launches-ai-browser-chatgpt-atlas-to-rival-google-chrome-perplexity" },
                ],
            },
        ],
    },
    ja: {
        title: "よくある質問",
        description: "ChatGPT Atlas と Comet ブラウザを比較して、ニーズに最適な AI 駆動ブラウジングソリューションを見つけましょう。",
        items: [
            {
                question: "ChatGPT Atlas vs Comet ブラウザ — どちらを選ぶべきですか？",
                answer: `**Atlas** (OpenAI) と **Comet** (Perplexity AI) はどちらも新世代の「エージェントブラウザ」を代表していますが、異なる強みを強調しています。

**Atlas** を選択: 執筆、コーディング、計画に ChatGPT を頻繁に使用している場合 — 創作ワークフローと生産性自動化に優れた統合を提供します。

**Comet** を選択: 高速でソースが豊富な回答、リアルタイムウェブアクセス、探索優先の体験を好む場合。`,
                references: [
                    { number: 4, url: "https://www.moneycontrol.com/technology/chatgpt-atlas-vs-perplexity-comet-how-the-two-ai-first-web-browsers-compare-in-terms-of-ai-capabilities-and-agentic-mode-article-13627733.html" },
                    { number: 5, url: "https://news.abplive.com/technology/chatgpt-atlas-vs-perplexity-comet-pricing-availaibility-features-privacy-accuracy-which-one-is-best-comparison-1807404" },
                ],
            },
            {
                question: "ChatGPT Atlas で Perplexity AI を使用できますか？",
                answer: `技術的には可能です — Atlas は Chromium ベースのブラウザなので、他のウェブサイトと同様に Atlas 内で Perplexity AI を開くことができます。ただし、両者の統合はネイティブではありません: ChatGPT と Comet は別々の AI エコシステムで動作します。

簡単に言えば、同じワークフロー内で一緒に使用できますが、**相互接続されたシステム**としては使用できません。`,
                references: [
                    { number: 2, url: "https://en.wikipedia.org/wiki/ChatGPT_Atlas" },
                    { number: 3, url: "https://www.extremetech.com/internet/openai-launches-ai-browser-chatgpt-atlas-to-rival-google-chrome-perplexity" },
                ],
            },
        ],
    },
    zh: {
        title: "常见问题",
        description: "比较 ChatGPT Atlas 和 Comet 浏览器，找到最适合您需求的 AI 驱动浏览解决方案。",
        items: [
            {
                question: "ChatGPT Atlas vs Comet 浏览器 — 我应该选择哪个？",
                answer: `**Atlas**（OpenAI）和 **Comet**（Perplexity AI）都代表了新一代"代理浏览器"，但它们强调不同的优势：

选择 **Atlas**：如果您已经大量依赖 ChatGPT 进行写作、编码和规划——它的集成非常适合创作工作流程和生产力自动化。

选择 **Comet**：如果您更喜欢快速、来源丰富的答案、实时网络访问和探索优先的体验。`,
                references: [
                    { number: 4, url: "https://www.moneycontrol.com/technology/chatgpt-atlas-vs-perplexity-comet-how-the-two-ai-first-web-browsers-compare-in-terms-of-ai-capabilities-and-agentic-mode-article-13627733.html" },
                    { number: 5, url: "https://news.abplive.com/technology/chatgpt-atlas-vs-perplexity-comet-pricing-availaibility-features-privacy-accuracy-which-one-is-best-comparison-1807404" },
                    { number: 6, url: "https://efficient.app/compare/atlas-vs-comet" },
                ],
            },
            {
                question: "我可以在 ChatGPT Atlas 中使用 Perplexity AI 吗？",
                answer: `从技术上讲，可以——您可以**像打开任何其他网站一样在 Atlas 中打开 Perplexity AI**，因为 Atlas 是基于 Chromium 的浏览器。但是，它们之间的集成不是原生的：ChatGPT 和 Comet 在不同的 AI 生态系统上运行。这意味着：

- 您可以在 Atlas 内使用 **Perplexity AI 的网站**（www.perplexity.ai）进行搜索。
- 但 **ChatGPT Atlas 的 Agent Mode** 和 **Perplexity 的 Comet 代理**不会互操作或共享上下文或记忆。
- ChatGPT 记忆、代理自动化和模型调用等功能保留在 Atlas 内；Perplexity 会话在其自己的站点环境中保持沙盒化。

简而言之，您可以在同一工作流程中**一起**使用它们，但不能作为**互连系统**使用。`,
                references: [
                    { number: 2, url: "https://en.wikipedia.org/wiki/ChatGPT_Atlas" },
                    { number: 3, url: "https://www.extremetech.com/internet/openai-launches-ai-browser-chatgpt-atlas-to-rival-google-chrome-perplexity" },
                ],
            },
        ],
    },
};
