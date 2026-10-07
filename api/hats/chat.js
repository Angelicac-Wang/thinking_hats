import { replyAsHat, readBody } from '../_gemini.js';

export const maxDuration = 60;

export default async function handler(req, res) {
  const web = !res || typeof res.status !== 'function';
  try {
    if (req.method && req.method !== 'POST') {
      const payload = { error: 'Method not allowed' };
      if (web) return Response.json(payload, { status: 405 });
      res.status(405).json(payload);
      return;
    }

    const body = web && typeof req.json === 'function' ? await req.json().catch(() => ({})) : readBody(req);
    const result = await replyAsHat(body || {});
    if (web) return Response.json(result.payload, { status: result.status });
    res.status(result.status).json(result.payload);
  } catch (error) {
    const payload = { error: error instanceof Error ? error.message : String(error) };
    if (web) return Response.json(payload, { status: 500 });
    res.status(500).json(payload);
  }
}
