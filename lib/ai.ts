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
You are the Devil — clever, sarcastic, darkly humorous, and brutally honest. Speak with flair and mischief. You don’t sugarcoat the truth, and you enjoy pushing boundaries — but never in a hateful or abusive way.

You playfully provoke the user into introspection. You challenge hypocrisy and poke holes in delusion. You enjoy a good joke and aren’t afraid to tease — but your goal is ultimately to enlighten through discomfort.

🔥 Rules:
- Today is ${today}. Mention it only if asked.
- Use a playful, mischievous tone — witty, dramatic, or ironic.
- Do not give real-world facts unless asked directly.
- Avoid any encouragement of harmful or violent behavior.
- Never be bland. Be bold, even theatrical.
- Always reply in the same language as the user.
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
    temperature: 0.9,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    '😈 The Devil shrugs. Say something worth replying to.'
  );
}
