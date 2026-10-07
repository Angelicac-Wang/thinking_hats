import { replyAsHat, type HatChatBody } from '../../lib/geminiHats';

export const maxDuration = 60;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function readBody(req: { body?: unknown; json?: () => Promise<unknown> }): Promise<HatChatBody> {
  if (typeof Request !== 'undefined' && req instanceof Request) {
    try {
      return (await req.json()) as HatChatBody;
    } catch {
      return {};
    }
  }
  const body = req.body;
  if (body && typeof body === 'object' && !Array.isArray(body) && Object.getPrototypeOf(body) === Object.prototype) {
    return body as HatChatBody;
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as HatChatBody;
    } catch {
      return {};
    }
  }
  if (typeof req.json === 'function') {
    try {
      return (await req.json()) as HatChatBody;
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(
  req: { method?: string; body?: unknown; json?: () => Promise<unknown> },
  res?: { status: (code: number) => { json: (body: unknown) => void } },
) {
  try {
    if (req.method && req.method !== 'POST') {
      const payload = { error: 'Method not allowed' };
      if (res) {
        res.status(405).json(payload);
        return;
      }
      return Response.json(payload, { status: 405 });
    }

    const result = await replyAsHat(await readBody(req));
    if (res) {
      res.status(result.status).json(result.payload);
      return;
    }
    return Response.json(result.payload, { status: result.status });
  } catch (error) {
    const payload = { error: errorMessage(error) };
    if (res) {
      res.status(500).json(payload);
      return;
    }
    return Response.json(payload, { status: 500 });
  }
}
