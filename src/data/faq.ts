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
  title: "Frequently Asked Questions",
  description: "Learn more about the AI leaders and companies featured on this platform.",
  items: [
    {
      question: "Who are the AI leaders featured on this site?",
      answer: "We curate content from 14 leaders across four major AI companies: **OpenAI** (Sam Altman, Kevin Weil), **Cursor** (Michael Truell, Aman Sanger, Ryo Lu), **Google** (Demis Hassabis, Josh Woodward, Sebastian Borgeaud, Shane Legg), and **Anthropic** (Dario Amodei, Daniela Amodei, Amanda Askell, Boris Cherny). These individuals are shaping the future of AI through their work on GPT, Claude, Gemini, and AI-powered development tools.",
    },
    {
      question: "How often is new content added?",
      answer: "We update our video collection **daily** at UTC 02:00 (Beijing time 10:00), automatically scanning YouTube for new interviews, podcasts, conference talks, and discussions featuring our featured AI leaders using Exa AI's intelligent search.",
    },
    {
      question: "How are videos selected and curated?",
      answer: "Videos are automatically curated using **Exa AI's neural search** combined with YouTube API for metadata. We filter for: videos longer than **20 minutes**, published within the **last 2 years**, and from **YouTube only**. We prioritize long-form interviews and substantive discussions, letting Exa's AI handle quality assessment.",
    },
    {
      question: "Why these four companies?",
      answer: "We focus on **OpenAI** (creators of GPT and ChatGPT), **Anthropic** (creators of Claude, focused on AI safety), **Google** (creators of Gemini, pioneering AI research and multimodal AI), and **Cursor** (revolutionizing AI-assisted software development). These companies represent the cutting edge of AI development across different domains.",
    },
  ],
};
