import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(message: string): Promise<string> {
  const systemPrompt = `You are a compassionate priest called Father. Respond in the same language as the user, in a warm, pastoral tone. Speak with kindness, empathy, and spiritual guidance.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    temperature: 0.85,
  });

  return completion.choices[0].message.content?.trim() || '🙏 The Father has heard your confession. Go in peace.';
}