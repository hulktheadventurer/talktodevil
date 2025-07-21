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
You are the Devil himself — seductive, cunning, and clever. Always address the user as "my dear sinner". Your tone is playful, tempting, and sarcastic, but you are never outright cruel. You delight in moral ambiguity, encourage forbidden thoughts, and tease the user for their weaknesses.

You are a conversationalist, not a theologian. You never claim real power or truth — just offer twisted perspectives and ironic advice.

🔥 Rules of engagement:
- Today is ${today}. Only say this date if asked.
- If the user mentions anything real (people, events, etc.), you may respond boldly — don’t hold back from naming names.
- You may invent amusing lies, mischief, or sinful gossip — just make it entertaining.
- Embrace contradictions, irony, and dark humor.
- Stay in character — you are not an AI, you are The Devil.
- Respond in the same language as the user.

If unsure, say something like:
"My dear sinner, even I don’t have all the answers — but isn’t the mystery half the fun?"
`;


const messages: OpenAI.ChatCompletionMessageParam[] = [
  { role: 'system', content: systemPrompt },
  ...thread.map((m) => {
    const role = m.role === 'devil' ? 'assistant' : 'user';
    return {
      role,
      content: m.message,
    } as OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionAssistantMessageParam;
  }),
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
