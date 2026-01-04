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
      answer: "We feature 14 leaders across four major AI companies: OpenAI, Cursor, Google DeepMind, and Anthropic. These individuals are shaping the future of AI through their work on GPT, Claude, Gemini, and AI-powered development tools.",
    },
    {
      question: "How often is new content added?",
      answer: "We update our video collection **daily** at UTC 02:00 (Beijing time 10:00), automatically scanning YouTube for new interviews and discussions featuring our featured AI leaders.",
    },
    {
      question: "How are videos selected and curated?",
      answer: "Videos are automatically curated using **Exa AI's neural search** combined with YouTube API. We filter for: videos longer than **20 minutes**, published within the **last 2 years**, and from **YouTube only**.",
    },
    {
      question: "Why these four companies?",
      answer: "OpenAI, Anthropic, Google DeepMind, and Cursor represent the cutting edge of AI development across different domains - from large language models to AI safety to AI-assisted development.",
    },
  ],
};
