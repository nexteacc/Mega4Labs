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
      answer: "We curate content from leaders at four major AI companies: **Sam Altman** (CEO, OpenAI), **Dario Amodei** (CEO, Anthropic), **Demis Hassabis** (CEO, Google DeepMind), and the founding team at **Cursor AI**. These individuals are shaping the future of artificial intelligence through their work on GPT, Claude, Gemini, and AI-powered development tools.",
    },
    {
      question: "How often is new content added?",
      answer: "We update our video collection weekly, automatically scanning YouTube for new interviews, podcasts, conference talks, and discussions featuring our featured AI leaders. Our quality filters ensure only substantive, high-quality content makes it to the site.",
    },
    {
      question: "How are videos selected and curated?",
      answer: "Videos are automatically curated based on relevance, view count (minimum 1,000 views), like ratio (minimum 2%), and recency (within the last 2 years). We prioritize long-form interviews and substantive discussions over promotional content or short clips.",
    },
    {
      question: "Can I suggest a video or person to add?",
      answer: "Yes! Use the 'Submit a Video' link in the footer to suggest new content or recommend additional AI leaders to feature. We review all submissions and add quality content that fits our curation criteria.",
    },
    {
      question: "Why these four companies?",
      answer: "We focus on **OpenAI** (creators of GPT and ChatGPT), **Anthropic** (creators of Claude, focused on AI safety), **Google DeepMind** (creators of Gemini, pioneering AI research and multimodal AI), and **Cursor** (revolutionizing AI-assisted software development). These companies represent the cutting edge of AI development across different domains.",
    },
  ],
};
