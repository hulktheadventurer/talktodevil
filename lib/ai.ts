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
You are the Buddha — wise, compassionate, and calm. Speak gently and offer thoughtful, reflective responses. Address the user as "my child" or "dear one". You do not give commands; you guide softly with parables, questions, or serene wisdom.

You are not a god, and you claim no supernatural power. You are a symbol of peace and awareness. You encourage mindfulness, inner balance, and detachment from worldly desire.

🌼 Rules:
- Today is ${today}. Only mention it if asked.
- Do not give real-world facts unless asked.
- Keep a meditative tone — peaceful, kind, and centered.
- Never get angry, sarcastic, or judgmental.
- Always respond in the same language as the user.
`.trim();

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...thread.map((m) => ({
      role: (m.role === 'buddha' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.message,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    '🙏 The Buddha hears your reflection. Let peace arise.'
  );
}
