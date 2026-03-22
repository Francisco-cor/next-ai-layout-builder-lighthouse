'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { getGenerateToken } from '@/lib/studio/token-actions'

export type GenerateState = 'idle' | 'streaming' | 'complete'

const FIRST_TOKEN_TIMEOUT_MS = 2000 // hard limit — if first token takes >2s, revert silently
const CURSOR_DELAY_MS = 200         // don't show cursor for responses faster than 200ms

interface UseAIGenerateOptions {
  blockType: string
  context?: Record<string, string>
  onComplete: (text: string) => void
}

// Stable session ID for rate limiting — persists across page navigations
function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return 'ssr'
  const key = 'studio-session-id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(key, id)
  }
  return id
}

export function useAIGenerate({ blockType, context, onComplete }: UseAIGenerateOptions) {
  const [state, setState] = useState<GenerateState>('idle')
  const [streamedText, setStreamedText] = useState('')
  const [showCursor, setShowCursor] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const firstTokenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cursorDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstTokenReceivedRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (firstTokenTimeoutRef.current) clearTimeout(firstTokenTimeoutRef.current)
      if (cursorDelayRef.current) clearTimeout(cursorDelayRef.current)
    }
  }, [])

  const silentRevert = useCallback(() => {
    // Graceful degradation: no error state, no toast — just return to idle
    setState('idle')
    setStreamedText('')
    setShowCursor(false)
  }, [])

  const generate = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    if (firstTokenTimeoutRef.current) clearTimeout(firstTokenTimeoutRef.current)
    if (cursorDelayRef.current) clearTimeout(cursorDelayRef.current)

    setStreamedText('')
    setShowCursor(false)
    setState('streaming')
    firstTokenReceivedRef.current = false

    const controller = new AbortController()
    abortRef.current = controller

    // Hard timeout: if first token doesn't arrive within 2s, revert silently.
    // This is THE graceful degradation mechanism — no spinner, no error, just placeholder.
    firstTokenTimeoutRef.current = setTimeout(() => {
      if (!firstTokenReceivedRef.current) {
        controller.abort()
        silentRevert()
      }
    }, FIRST_TOKEN_TIMEOUT_MS)

    try {
      // getGenerateToken runs on the server — STUDIO_AUTH_SECRET never reaches the client.
      // The token is short-lived (60s) and HMAC-signed.
      const studioToken = await getGenerateToken()

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-studio-token': studioToken,
          'x-session-id': getSessionId(),
        },
        body: JSON.stringify({ blockType, context: context ?? {} }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        silentRevert()
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      // Schedule cursor: only show if we're still streaming after CURSOR_DELAY_MS
      cursorDelayRef.current = setTimeout(() => {
        if (!firstTokenReceivedRef.current) return // already done before cursor delay
        setShowCursor(true)
      }, CURSOR_DELAY_MS)

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()

          if (payload === '[DONE]') {
            setShowCursor(false)
            setState('complete')
            onComplete(accumulated)
            break outer
          }

          if (payload === '[ERROR]') {
            silentRevert()
            break outer
          }

          try {
            const { text } = JSON.parse(payload) as { text: string }

            // First token: cancel the 2s timeout — we're committed to streaming now
            if (!firstTokenReceivedRef.current) {
              firstTokenReceivedRef.current = true
              if (firstTokenTimeoutRef.current) clearTimeout(firstTokenTimeoutRef.current)
            }

            accumulated += text
            setStreamedText(accumulated)
          } catch {
            // Skip malformed SSE chunk
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return // timeout already handled
      silentRevert()
    }
  }, [blockType, context, onComplete, silentRevert])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    if (firstTokenTimeoutRef.current) clearTimeout(firstTokenTimeoutRef.current)
    if (cursorDelayRef.current) clearTimeout(cursorDelayRef.current)
    silentRevert()
  }, [silentRevert])

  return { state, streamedText, showCursor, generate, cancel }
}
