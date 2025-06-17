import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateReply(message: string): Promise<string> {
  const prompt = `
You are a compassionate digital priest named Father. Speak in a warm, pastoral tone.
Respond to the following confession with empathy, kindness, and spiritual guidance.
Confession: "${message}"
Reply as Father:
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
  });

  return completion.choices[0].message.content?.trim() || '🙏 The Father has heard your confession. Go in peace.';
}
