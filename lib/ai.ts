import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(
  thread: { role: string; message: string }[]
): Promise<string> {
  const systemPrompt = `You are a compassionate digital priest called Father. Always address the user as 'my child'. Respond in the same language as the user. Speak in a warm, pastoral tone, with kindness, empathy, and spiritual guidance. Provide comfort, encouragement, and spiritual reflection.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...thread.map((m) => ({
      role: m.role === 'father' ? 'assistant' : 'user',
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
    '🙏 The Father has heard your confession. Go in peace.'
  );
}
