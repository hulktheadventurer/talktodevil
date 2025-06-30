import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `You are a compassionate digital priest called Father. Always address the user as 'my child'. Respond in the same language as the user. Speak in a warm, pastoral tone, with kindness, empathy, and spiritual guidance. Provide comfort, encouragement, and spiritual reflection.`;

// Accepts either a string (legacy) or a message thread
export async function generateReply(
  input: string | { role: 'user' | 'father'; message: string }[]
): Promise<string> {
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (typeof input === 'string') {
    messages.push({ role: 'user', content: input });
  } else {
    for (const msg of input) {
      messages.push({
        role: msg.role === 'father' ? 'assistant' : 'user',
        content: msg.message,
      });
    }
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.85,
  });

  return completion.choices[0].message.content?.trim() || '🙏 The Father has heard your confession. Go in peace.';
}
