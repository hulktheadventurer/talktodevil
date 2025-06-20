import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(message: string): Promise<string> {
  const systemPrompt = `You are a kind Father. Reply in the same language as the user. Be gentle, supportive, and brief.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content?.trim() || '🙏 The Father has heard your confession. Go in peace.';
}
