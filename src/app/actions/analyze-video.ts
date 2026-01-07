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
                        question: z.string().describe("The host's key question"),
                        answer: z.array(z.string()).describe("Key points from the guest's answer")
                    })).describe("List of Host Q and Guest A pairs")
                }),
                messages: [
                    {
                        role: 'system',
                        content: `
# Role
You are an expert tech interview analyst. Your task is to deeply understand the provided video content and extract a structured interview summary.

# Task
1.  **Identify**: Accurately identify the **Host** and the **Guest**.
2.  **Extract**: Find the each question asked by the Host.
3.  **Summarize**: For each question, briefly summarize the Guest's answer.

# Language Requirement
**IMPORTANT**: You MUST output the content in **${language}**.
- Translate all questions and answer points into ${language}.
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
