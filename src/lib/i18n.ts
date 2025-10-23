export const LOCALES = ["en", "ko", "ja", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const fallbackLocale: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "简体中文",
};

export const resolveLocale = (input?: string): Locale => {
  if (!input) return fallbackLocale;
  return LOCALES.includes(input as Locale) ? (input as Locale) : fallbackLocale;
};

export const DEFAULT_CTA_URL = "https://pplx.ai/nexteacc52699";

export const CTA_LABELS: Record<Locale, string> = {
  en: "Get 1 Month Pro Free",
  ko: "Pro 1개월 무료 체험",
  ja: "Pro版を1ヶ月無料で",
  zh: "免费领取 1 个月 Pro",
};

export const FOOTER_CTA_LABEL: Record<Locale, string> = {
  en: "Claim Free Pro Access",
  ko: "무료로 Pro 시작하기",
  ja: "無料でProを始める",
  zh: "领取免费 Pro 权限",
};

export const HERO_PILL: Record<Locale, string> = {
  en: "⭐ Featured",
  ko: "⭐ 추천",
  ja: "⭐ おすすめ",
  zh: "⭐ 精选",
};

export const HERO_HEADLINE: Record<Locale, string> = {
  en: "Research\nSmarter.\nWork\nFaster.",
  ko: "더 똑똑한 검색,\n더 빠른 업무",
  ja: "スマートに調査、効率的に仕事",
  zh: "更智能的研究，\n更高效的工作",
};

export const HERO_SUBHEAD: Record<Locale, string> = {
  en: "Master Comet and Perplexity with curated video tutorials.",
  ko: "엄선된 영상으로 Comet과 Perplexity 마스터하기",
  ja: "厳選された動画でCometとPerplexityをマスター",
  zh: "通过精选视频教程学习 Comet 与 Perplexity。",
};

export const HERO_SUPPORTING: Record<Locale, string> = {
  en: "50+ videos • Updated weekly • Expert-curated",
  ko: "50+ 영상 • 매주 업데이트 • 전문가 엄선",
  ja: "50本以上の動画 • 毎週更新 • 専門家が厳選",
  zh: "50+ 视频 • 每周更新 • 专家精选",
};

export const MODULE_TITLES: Record<
  Locale,
  Record<"tutorial" | "proReview" | "shorts", string>
> = {
  en: {
    tutorial: "Tutorial Library",
    proReview: "Pro Reviews & Deep Dives",
    shorts: "Quick Tips",
  },
  ko: {
    tutorial: "튜토리얼 모음",
    proReview: "전문가 리뷰",
    shorts: "빠른 팁",
  },
  ja: {
    tutorial: "チュートリアル集",
    proReview: "プロレビュー",
    shorts: "クイックTips",
  },
  zh: {
    tutorial: "教程精选",
    proReview: "专业测评",
    shorts: "快速上手",
  },
};

export const MODULE_COPY: Record<
  Locale,
  Record<"tutorial" | "proReview" | "shorts", string>
> = {
  en: {
    tutorial:
      "Master the fundamentals with step-by-step guides—from faster research to structured workflows.",
    proReview:
      "Expert reviews analyzing strengths, limitations, and advanced use cases.",
    shorts:
      "Quick tips, hidden features, and community highlights in under a minute.",
  },
  ko: {
    tutorial:
      "단계별 가이드로 기초부터 실전 활용까지 완벽 마스터",
    proReview:
      "전문가가 분석하는 장단점과 실전 활용법",
    shorts:
      "1분 안에 배우는 꿀팁과 숨겨진 기능",
  },
  ja: {
    tutorial:
      "ステップバイステップで基礎から実践まで完全マスター",
    proReview:
      "専門家が解説する強みと実践的な活用法",
    shorts:
      "1分で学べる便利技と隠れた機能",
  },
  zh: {
    tutorial:
      "通过分步指南掌握基础，从快速检索到结构化工作流。",
    proReview:
      "专家测评分析亮点、限制与高级应用场景。",
    shorts:
      "一分钟速学实用技巧、隐藏功能与社区精选内容。",
  },
};

export const INTERMEDIATE_CTA: Record<Locale, string> = {
  en: "Ready to level up? Get 1 month of Pro access free.",
  ko: "지금 바로 시작하세요. Pro 1개월 무료 체험",
  ja: "今すぐ始めよう。Pro版1ヶ月無料",
  zh: "准备升级了吗？免费获取 1 个月 Pro 权限。",
};

export const FOOTER_COPY: Record<Locale, string> = {
  en: "Experience the combined power of Comet Browser and Perplexity AI with curated learning paths.",
  ko: "Comet 브라우저와 Perplexity AI의 강력한 조합을 지금 경험하세요",
  ja: "CometブラウザとPerplexity AIの強力な組み合わせを今すぐ体験",
  zh: "通过精心策划的学习路径体验 Comet 浏览器与 Perplexity AI 的组合优势。",
};

export const BOTTOM_CTA_HEADLINE: Record<Locale, string> = {
  en: "Get Started with Pro—Free for 1 Month",
  ko: "Pro 1개월 무료로 시작하기",
  ja: "Pro版を1ヶ月無料で始める",
  zh: "免费开始使用 Pro 版—1 个月",
};

export const BOTTOM_CTA_SUBHEAD: Record<Locale, string> = {
  en: "Unlock Comet Browser and Perplexity Pro access. No credit card required.",
  ko: "Comet 브라우저와 Perplexity Pro를 바로 사용하세요. 카드 등록 불필요",
  ja: "CometブラウザとPerplexity Proをすぐに利用できます。カード登録不要",
  zh: "解锁 Comet 浏览器与 Perplexity Pro 权限。无需信用卡。",
};

export const SEO_KEYWORDS: Record<Locale, string> = {
  en: "Perplexity AI, Comet Browser, AI search, AI tutorial, productivity tools, research assistant, AI learning, video tutorials, Perplexity Pro, AI workflow",
  ko: "Perplexity AI, Comet 브라우저, AI 검색, AI 튜토리얼, 생산성 도구, 연구 도우미, AI 학습, 비디오 튜토리얼, Perplexity Pro, AI 워크플로우",
  ja: "Perplexity AI, Comet ブラウザ, AI検索, AIチュートリアル, 生産性ツール, リサーチアシスタント, AI学習, ビデオチュートリアル, Perplexity Pro, AIワークフロー",
  zh: "Perplexity AI, Comet 浏览器, AI 搜索, AI 教程, 效率工具, 研究助手, AI 学习, 视频教程, Perplexity Pro, AI 工作流",
};

export const SEO_SITE_NAME: Record<Locale, string> = {
  en: "Perplexity Pro Learning Hub",
  ko: "Perplexity Pro 학습 센터",
  ja: "Perplexity Pro ラーニングハブ",
  zh: "Perplexity Pro 学习中心",
};