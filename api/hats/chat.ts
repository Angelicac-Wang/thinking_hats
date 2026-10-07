import { replyAsHat, type HatChatBody } from '../../lib/geminiHats';

export const maxDuration = 60;

async function handle(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: HatChatBody = {};
  try {
    body = (await request.json()) as HatChatBody;
  } catch {
    body = {};
  }

  const result = await replyAsHat(body);
  return Response.json(result.payload, { status: result.status });
}

export function POST(request: Request) {
  return handle(request);
}

export default {
  fetch(request: Request) {
    return handle(request);
  },
};
