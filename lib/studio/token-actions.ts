'use server'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const TOKEN_TTL_MS = 60_000 // tokens valid for 60 seconds

// Issues a short-lived HMAC-signed token for the AI generate endpoint.
// Runs only on the server — STUDIO_AUTH_SECRET never reaches the client bundle.
export async function getGenerateToken(): Promise<string> {
  const secret = process.env.STUDIO_AUTH_SECRET
  if (!secret) throw new Error('STUDIO_AUTH_SECRET is not configured')

  const nonce = randomBytes(16).toString('hex')
  const expiresAt = (Date.now() + TOKEN_TTL_MS).toString()
  const payload = `${nonce}:${expiresAt}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${sig}`
}

// Validates a token produced by getGenerateToken. Used in /api/generate.
export function validateGenerateToken(token: string | null): boolean {
  if (!token) return false
  const secret = process.env.STUDIO_AUTH_SECRET
  if (!secret) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false
  const [nonce, expiresAt, sig] = parts

  if (isNaN(Number(expiresAt)) || Date.now() > Number(expiresAt)) return false

  const payload = `${nonce}:${expiresAt}`
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')

  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))
  } catch {
    return false
  }
}
