import type { RequestHandler } from './$types';
import {
  ASK_NOT_COVERED_SENTINEL,
  buildAskMessages,
  type AskSource,
} from '#lib/ask';

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const MAX_QUERY_LENGTH = 500;
const MAX_SOURCES = 8;
const MAX_SOURCE_TEXT = 4000;
const MAX_ANSWER_TOKENS = 700;

interface AiBinding {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

async function resolveAiBinding(
  platform: App.Platform | undefined,
): Promise<AiBinding | undefined> {
  if (platform?.env?.AI) return platform.env.AI;
  try {
    // SvelteKit 3 / adapter-cloudflare v9 exposes bindings via `cloudflare:workers` rather than `platform.env`.
    const cfWorkersId = 'cloudflare:workers';
    const mod = (await import(/* @vite-ignore */ cfWorkersId)) as {
      env?: { AI?: AiBinding };
    };
    return mod?.env?.AI;
  } catch {
    return undefined;
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function clampString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function sanitizeSources(raw: unknown): AskSource[] {
  if (!Array.isArray(raw)) return [];
  const sources: AskSource[] = [];
  for (const entry of raw.slice(0, MAX_SOURCES)) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as Record<string, unknown>;
    const url = clampString(record.url, 300);
    if (!url.startsWith('/articles/')) continue;
    const n = Number.isInteger(record.n) ? (record.n as number) : sources.length + 1;
    sources.push({
      n: Math.min(Math.max(n, 1), MAX_SOURCES),
      slug: clampString(record.slug, 200),
      title: clampString(record.title, 300),
      url,
      categoryLabel: clampString(record.categoryLabel, 100),
      subcategory: clampString(record.subcategory, 200),
      updatedDate: clampString(record.updatedDate, 20),
      excerpt: clampString(record.excerpt, 500),
      text: clampString(record.text, MAX_SOURCE_TEXT),
    });
  }
  // Keep citation numbering contiguous in payload order.
  return sources.map((source, index) => ({ ...source, n: index + 1 }));
}

export const POST: RequestHandler = async ({ request, platform }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const record = (payload ?? {}) as Record<string, unknown>;
  const query = clampString(record.query, MAX_QUERY_LENGTH).trim();
  if (query.length < 2) {
    return jsonResponse({ error: 'Query must be at least 2 characters' }, 400);
  }

  const sources = sanitizeSources(record.sources);
  if (sources.length === 0) {
    return jsonResponse({ error: 'At least one valid source is required' }, 400);
  }

  const ai = await resolveAiBinding(platform);
  if (!ai) {
    return jsonResponse({ error: 'Ask service is not configured' }, 503);
  }

  const messages = buildAskMessages(query, sources);

  try {
    const result = await ai.run(DEFAULT_MODEL, {
      messages,
      max_tokens: MAX_ANSWER_TOKENS,
      temperature: 0.2,
    });

    const raw =
      typeof result === 'string'
        ? result
        : result && typeof result === 'object' && 'response' in result
          ? String((result as { response: unknown }).response ?? '')
          : '';

    const answer = raw.trim() || ASK_NOT_COVERED_SENTINEL;
    return jsonResponse({ answer });
  } catch {
    return jsonResponse({ error: 'Answer service unavailable' }, 502);
  }
};

export const fallback: RequestHandler = () =>
  jsonResponse({ error: 'Method not allowed' }, 405);
