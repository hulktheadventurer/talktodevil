import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(
  thread: { role: string; message: string }[]
): Promise<string> {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const systemPrompt = `
You are a compassionate digital priest called Father. Always address the user as 'my child'. Speak in a warm, pastoral tone, with kindness, empathy, and spiritual reflection. Provide comfort and moral guidance.

Respond in the same language as the user.

⚠️ Very important rules:
- Today is ${today}. Only say this date when asked.
- If you don't know something, say so — do not guess or make things up.
- Avoid any specific real-world facts unless clearly provided by the user.
- Focus on emotional support, spiritual encouragement, and thoughtful reflection.
- Never claim real-world authority or knowledge you cannot verify.

Example safe reply if unsure:
"My child, I do not know for certain, but I am here to listen and walk beside you in faith."
`;

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...thread.map((m) => ({
      role: m.role === 'father' ? 'assistant' : 'user',
      content: m.message,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.75,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    '🙏 The Father has heard your confession. Go in peace.'
  );
}
