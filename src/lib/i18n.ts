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
  ko: "1개월 Pro 무료 받기",
  ja: "1ヶ月Pro無料取得",
  zh: "免费领取 1 个月 Pro",
};

export const FOOTER_CTA_LABEL: Record<Locale, string> = {
  en: "Claim Free Pro Access",
  ko: "무료 Pro 액세스 받기",
  ja: "無料Proアクセスを取得",
  zh: "领取免费 Pro 权限",
};

export const HERO_PILL: Record<Locale, string> = {
  en: "⭐ Featured",
  ko: "⭐ 추천",
  ja: "⭐ おすすめ",
  zh: "⭐ 精选",
};

export const HERO_HEADLINE: Record<Locale, string> = {
  en: "Research Smarter.\nWork Faster.",
  ko: "더 스마트한 리서치.\n더 빠른 작업.",
  ja: "スマートに調査。\n速く仕事。",
  zh: "更智能的研究，\n更高效的工作",
};

export const HERO_SUBHEAD: Record<Locale, string> = {
  en: "Learn Comet and Perplexity through curated video tutorials.",
  ko: "엄선된 비디오 튜토리얼로 Comet과 Perplexity를 배우세요.",
  ja: "厳選されたビデオチュートリアルでCometとPerplexityを学ぶ。",
  zh: "通过精选视频教程学习 Comet 与 Perplexity。",
};

export const HERO_SUPPORTING: Record<Locale, string> = {
  en: "50+ videos • Updated weekly • Expert-curated",
  ko: "50+ 비디오 • 매주 업데이트 • 전문가 선별",
  ja: "50+ 動画 • 毎週更新 • 専門家厳選",
  zh: "50+ 视频 • 每周更新 • 专家精选",
};

export const MODULE_TITLES: Record<
  Locale,
  Record<"tutorial" | "proReview" | "shorts", string>
> = {
  en: {
    tutorial: "Tutorial Library",
    proReview: "Pro Reviews & Deep Dives",
    shorts: "Shorts Wall",
  },
  ko: {
    tutorial: "튜토리얼 라이브러리",
    proReview: "전문 리뷰 & 딥 다이브",
    shorts: "쇼츠 월",
  },
  ja: {
    tutorial: "チュートリアルライブラリ",
    proReview: "プロレビュー & 深堀り",
    shorts: "ショート動画ウォール",
  },
  zh: {
    tutorial: "教程精选",
    proReview: "专业测评",
    shorts: "短视频墙",
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
      "단계별 가이드로 기본을 익히고 연구 속도와 워크플로를 높여보세요.",
    proReview:
      "전문가 리뷰로 장점, 한계, 고급 활용 사례를 분석합니다.",
    shorts:
      "1분 안에 끝나는 꿀팁, 숨겨진 기능, 커뮤니티 하이라이트.",
  },
  ja: {
    tutorial:
      "ステップガイドで基本を習得し、リサーチとワークフローを加速。",
    proReview:
      "エキスパートレビューで強み・限界・高度なユースケースを分析。",
    shorts:
      "1分以内のヒント・隠れ機能・コミュニティハイライト。",
  },
  zh: {
    tutorial:
      "通过分步指南掌握基础，从快速检索到结构化工作流。",
    proReview:
      "专家测评分析亮点、限制与高级应用场景。",
    shorts:
      "一分钟内的实用技巧、隐藏功能与社区精选。",
  },
};

export const INTERMEDIATE_CTA: Record<Locale, string> = {
  en: "Ready to level up? Get 1 month of Pro access free.",
  ko: "레벨업할 준비가 되셨나요? 1개월 Pro 액세스를 무료로 받으세요.",
  ja: "レベルアップの準備はできましたか？1ヶ月のProアクセスを無料で。",
  zh: "准备升级了吗？免费获取 1 个月 Pro 权限。",
};

export const FOOTER_COPY: Record<Locale, string> = {
  en: "Experience the combined power of Comet Browser and Perplexity AI with curated learning paths.",
  ko: "Comet 브라우저와 Perplexity AI를 함께 사용해 정교하게 구성된 학습 경로를 경험해보세요.",
  ja: "Comet ブラウザと Perplexity AI の組み合わせで設計された学習パスを体験しましょう。",
  zh: "通过精心策划的学习路径体验 Comet 浏览器与 Perplexity AI 的组合优势。",
};

export const BOTTOM_CTA_HEADLINE: Record<Locale, string> = {
  en: "Get Started with Pro—Free for 1 Month",
  ko: "Pro로 시작하기—1개월 무료",
  ja: "Proで始める—1ヶ月無料",
  zh: "免费开始使用 Pro 版—1 个月",
};

export const BOTTOM_CTA_SUBHEAD: Record<Locale, string> = {
  en: "Unlock Comet Browser and Perplexity Pro access. No credit card required.",
  ko: "Comet 브라우저와 Perplexity Pro 액세스를 잠금 해제하세요. 신용카드 불필요.",
  ja: "Comet ブラウザとPerplexity Proアクセスをアンロック。クレジットカード不要。",
  zh: "解锁 Comet 浏览器与 Perplexity Pro 权限。无需信用卡。",
};