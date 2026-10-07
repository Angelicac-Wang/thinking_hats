import { synthesizeReport } from '../../lib/geminiHats';

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: { method?: string; body?: { topic?: string; history?: Array<{ speakerName?: string; hat?: string; text?: string }> } },
  res: { status: (code: number) => { json: (body: unknown) => void } },
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result = await synthesizeReport(req.body || {});
  res.status(result.status).json(result.payload);
}
