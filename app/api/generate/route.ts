import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { validateGenerateToken } from '@/lib/studio/token-actions'
import { logger } from '@/lib/logger'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Uses Upstash Redis when UPSTASH_REDIS_REST_URL is configured (recommended for
// production — persistent across cold starts and instances).
// Falls back to an in-memory store for local dev / demo deployments.

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

// Upstash path — loaded lazily so the module doesn't fail when env vars are absent
async function checkRateLimitRedis(sessionId: string): Promise<boolean> {
  const { Redis } = await import('@upstash/redis')
  const { Ratelimit } = await import('@upstash/ratelimit')
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, '1 h'),
    prefix: 'studio:generate',
  })
  const { success } = await ratelimit.limit(sessionId)
  return success
}

// In-memory fallback — resets on cold start
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimitMemory(sessionId: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(sessionId)
  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

async function checkRateLimit(sessionId: string): Promise<boolean> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return checkRateLimitRedis(sessionId)
  }
  return checkRateLimitMemory(sessionId)
}

function buildPrompt(blockType: string, context: Record<string, string>): string {
  const ctx = Object.entries(context)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n') || 'Modern B2B SaaS product'

  const prompts: Record<string, string> = {
    richTextBlock: `Write engaging body copy for a B2B software company's webpage section.

Context:
${ctx}

Requirements:
- 2-3 short paragraphs
- Professional but conversational tone
- Focus on value proposition and concrete benefits
- Plain text only — no markdown, no bullet points
- Each paragraph max 3 sentences

Output only the text. No preamble, no explanations.`,

    heroBlock: `Write a compelling hero section headline for a B2B software company.

Context:
${ctx}

Output exactly in this format (no other text):
TITLE: [Punchy headline, max 8 words, no punctuation at end]
SUBTITLE: [Supporting sentence, 15-25 words, explains the value]
CTA: [Button text, 2-4 action words]`,

    featureGridBlock: `Generate 3 product features for a B2B software company.

Context:
${ctx}

Output exactly in this format, features separated by ---:
ICON: [single emoji]
TITLE: [Feature name, 3-5 words]
DESCRIPTION: [One sentence benefit, max 15 words]
---
ICON: [single emoji]
TITLE: [Feature name, 3-5 words]
DESCRIPTION: [One sentence benefit, max 15 words]
---
ICON: [single emoji]
TITLE: [Feature name, 3-5 words]
DESCRIPTION: [One sentence benefit, max 15 words]`,

    callToActionBlock: `Write a call-to-action banner for a B2B software company.

Context:
${ctx}

Output exactly in this format:
HEADING: [Compelling headline that prompts action, max 8 words]
SUBHEADING: [Supporting text, 12-20 words]
BUTTON: [Action text, 3-5 words]`,

    statsBlock: `Generate 4 compelling company statistics for a B2B software product.

Context:
${ctx}

Output exactly in this format, one stat per line:
VALUE: 98% | LABEL: Customer satisfaction
VALUE: 10x | LABEL: Faster deployment
VALUE: 500+ | LABEL: Enterprise clients
VALUE: <2s | LABEL: Average response time

Replace the examples with realistic stats matching the context.`,

    testimonialsBlock: `Write an authentic customer testimonial for a B2B software product.

Context:
${ctx}

Output exactly in this format:
QUOTE: [2-3 sentence testimonial that mentions a specific benefit or result]
AUTHOR: [Full name]
ROLE: [Job title, Company name]`,
  }

  return prompts[blockType] ?? `Write concise, professional content for a ${blockType} web section. Context: ${ctx}. Output plain text only.`
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  // Short-lived HMAC token issued by getGenerateToken() server action.
  // STUDIO_AUTH_SECRET never reaches the client — only the signed token does.
  const token = req.headers.get('x-studio-token')
  if (!validateGenerateToken(token)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Rate limit ─────────────────────────────────────────────────────────────
  const sessionId = req.headers.get('x-session-id') ?? 'anonymous'
  const allowed = await checkRateLimit(sessionId)
  if (!allowed) {
    logger.warn('generate_rate_limited', { sessionId })
    return new Response(
      JSON.stringify({ error: `Rate limit: max ${RATE_LIMIT_MAX} generations per hour` }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let blockType: string
  let context: Record<string, string>
  try {
    const body = await req.json()
    blockType = body.blockType ?? 'richTextBlock'
    context = body.context ?? {}
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const prompt = buildPrompt(blockType, context)
  logger.info('generate_started', { blockType, sessionId })

  // ── SSE stream ─────────────────────────────────────────────────────────────
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: string) {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      try {
        // claude-haiku-4-5 for fast TTFT — critical for the 2s graceful degradation test
        const anthropicStream = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta' &&
            event.delta.text
          ) {
            send(JSON.stringify({ text: event.delta.text }))
          }
        }

        send('[DONE]')
        logger.info('generate_complete', { blockType, sessionId })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        logger.error('generate_stream_error', { blockType, sessionId, message })
        send('[ERROR]')
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no', // disable nginx buffering on Vercel
    },
  })
}
