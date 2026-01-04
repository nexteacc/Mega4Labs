/**
 * FAQ Data for Mega 4 Labs
 */

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQData = {
  title: string;
  description: string;
  items: FAQItem[];
};

export const FAQ_DATA: FAQData = {
  title: "FAQ",
  description: "Learn more about the AI leaders and companies featured on this platform.",
  items: [
    {
      question: "Who are the AI leaders featured on this site?",
      answer: "We feature 13 leaders across four major AI companies: OpenAI, Cursor, Google DeepMind, and Anthropic. These individuals are shaping the future of AI through their work on GPT, Claude, Gemini, and AI-powered development tools.",
    },
    {
      question: "How often is new content added?",
      answer: "We update our video collection **daily** at UTC 02:00, automatically scanning YouTube for new interviews and discussions featuring our featured AI leaders.",
    },
    {
      question: "How are videos selected and curated?",
      answer: "Videos are automatically curated using **Exa AI's neural search** combined with YouTube API. We filter for: videos longer than **20 minutes**, published within the **last 2 years**, and from **YouTube only**.",
    },
    {
      question: "Why these four companies?",
      answer: "**OpenAI** pioneered large language models at scale with ChatGPT. **Anthropic** focuses on AI safety and building reliable, interpretable AI systems. **Google DeepMind** leads in fundamental AI research and multimodal models. **Cursor** demonstrates practical AI applications in software development.",
    },
  ],
};
