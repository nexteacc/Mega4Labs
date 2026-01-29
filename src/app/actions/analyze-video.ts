'use server';

import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { z } from 'zod';

export async function analyzeVideo(videoUrl: string, customInstruction?: string, language: string = 'English') {
    'use server';

    const stream = createStreamableValue();

    (async () => {
        try {
            const { partialObjectStream } = await streamObject({
                model: google('gemini-2.5-flash'),
                output: 'object',
                schema: z.object({
                    analysis: z.array(z.object({
                        timestamp: z.number().describe("The start time in seconds for this topic/question"),
                        topic: z.string().describe("A short, 1-3 word topic name"),
                        question: z.string().describe("The host's key question"),
                        answer: z.array(z.string()).describe("Key points from the guest's answer")
                    })).describe("List of timestamped Host Q and Guest A pairs")
                }),
                messages: [
                    {
                        role: 'system',
                        content: `
# Role
You are an expert tech interview analyst. Your task is to deeply understand the provided video content and extract a structured interview summary with precise timestamps.

# Task
1.  **Extract Topics**: Identify major topics discussed. For each topic:
    - **timestamp**: Provide the exact start time in seconds (integer) when this topic or question begins.
    - **topic**: A concise label (1-3 words, e.g., "Architecture", "Scalability").
    - **question**: The core question being addressed.
    - **answer**: A list of bullet points summarizing the key insights.

2.  **Structure**: Focus on the TQA (Topic-Question-Answer) hierarchy. Ensure timestamps are chronological.

# Language Requirement
**IMPORTANT**: You MUST output the content in **${language}**.
- Translate all topics, questions and answer points into ${language}.
- Keep technical terms in English if appropriate for clarity.

# Custom Instruction
${customInstruction ? `User specific focus: ${customInstruction}` : ''}
              `,
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'file',
                                data: videoUrl,
                                mediaType: 'video/mp4'
                            },
                            {
                                type: 'text',
                                text: 'Please analyze this video according to the system instructions.'
                            }
                        ]
                    },
                ],
            });

            for await (const partialObject of partialObjectStream) {
                stream.update(partialObject);
            }
        } catch (error) {
            console.error("Stream generation failed:", error);
            stream.error(error);
        }

        stream.done();
    })();

    return { output: stream.value };
}
