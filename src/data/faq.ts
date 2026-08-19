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
  title: "About Mega 4 Labs",
  description: "How videos are found, selected, and updated.",
  items: [
    {
      question: "What is Mega 4 Labs?",
      answer: "Mega 4 Labs is an index of long-form interviews and talks featuring people from OpenAI, Anthropic, Google DeepMind, Cursor, and a16z.",
    },
    {
      question: "How often is new content added?",
      answer: "New videos are added **weekly**.",
    },
    {
      question: "How are videos selected?",
      answer: "We use **Tavily** to find long-form interviews and talks on YouTube.",
    },
    {
      question: "Which organizations are covered?",
      answer: "The current library covers **OpenAI**, **Anthropic**, **Google DeepMind**, **Cursor**, and **a16z**.",
    },
  ],
};
