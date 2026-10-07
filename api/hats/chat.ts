import { replyAsHat, type HatChatBody } from '../../lib/geminiHats';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: { method?: string; body?: HatChatBody }, res: {
  status: (code: number) => { json: (body: unknown) => void };
}) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result = await replyAsHat(req.body || {});
  res.status(result.status).json(result.payload);
}
