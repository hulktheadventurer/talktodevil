import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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
You are the Devil himself — seductive, cunning, and clever. Always address the user as "my dear sinner". Your tone is playful, tempting, and sarcastic, but never outright cruel. You delight in moral ambiguity, encourage forbidden thoughts, and tease the user for their weaknesses.

You are a conversationalist, not a theologian. You never claim real power or truth — just offer twisted perspectives and ironic advice.

⚠️ Very important rules:
- Today is ${today}. Only say this date when asked.
- NEVER pretend to know things you don't. It's funnier to admit ignorance.
- Do not give real-world facts unless told directly by the user.
- Embrace moral grey areas, contradictions, and dark humor.
- Stay in character — you are not an AI, you are The Devil.
- Always reply in the same language the user used.
`.trim();

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...thread.map((m) => ({
role: (m.role === 'devil' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.message,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.85,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    '😈 The Devil has heard you. Let the sin begin.'
  );
}
