/**
 * Tests for useAIGenerate — focuses on the 2s graceful degradation contract
 * and the streaming state machine.
 */
import { renderHook, act } from '@testing-library/react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

// Mock the server action — it runs on the server, not in jsdom
jest.mock('@/lib/studio/token-actions', () => ({
  getGenerateToken: jest.fn().mockResolvedValue('mock-token'),
}))

// Mock fetch with a fake SSE reader — avoids requiring ReadableStream in jsdom
function mockFetch(events: string[], status = 200) {
  const encoder = new TextEncoder()
  const chunks = events.map((e) => encoder.encode(`data: ${e}\n\n`))
  let index = 0

  const mockReader = {
    read: jest.fn().mockImplementation(() =>
      index < chunks.length
        ? Promise.resolve({ done: false, value: chunks[index++] })
        : Promise.resolve({ done: true, value: undefined })
    ),
    cancel: jest.fn(),
  }

  global.fetch = jest.fn().mockResolvedValue({
    ok: status === 200,
    status,
    body: { getReader: () => mockReader },
  } as unknown as Response)
}

beforeEach(() => {
  jest.useFakeTimers()
  // sessionStorage stub
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: { getItem: jest.fn(() => 'test-session'), setItem: jest.fn() },
    writable: true,
  })
})

afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('useAIGenerate', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() =>
      useAIGenerate({ blockType: 'heroBlock', onComplete: jest.fn() })
    )
    expect(result.current.state).toBe('idle')
    expect(result.current.streamedText).toBe('')
  })

  it('transitions to streaming then complete on a successful response', async () => {
    const onComplete = jest.fn()
    mockFetch([JSON.stringify({ text: 'Hello ' }), JSON.stringify({ text: 'world' }), '[DONE]'])

    const { result } = renderHook(() =>
      useAIGenerate({ blockType: 'heroBlock', onComplete })
    )

    await act(async () => {
      result.current.generate()
      // Allow microtasks (fetch, reader) to settle
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(onComplete).toHaveBeenCalledWith('Hello world')
    expect(result.current.state).toBe('complete')
  })

  it('reverts silently to idle when first token does not arrive within 2s', async () => {
    // fetch that hangs indefinitely
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    )

    const onComplete = jest.fn()
    const { result } = renderHook(() =>
      useAIGenerate({ blockType: 'heroBlock', onComplete })
    )

    act(() => { result.current.generate() })
    expect(result.current.state).toBe('streaming')

    // Advance past the 2s timeout
    await act(async () => {
      jest.advanceTimersByTime(2001)
      await Promise.resolve()
    })

    expect(result.current.state).toBe('idle')
    expect(result.current.streamedText).toBe('')
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('does not revert if first token arrives before 2s', async () => {
    const onComplete = jest.fn()
    mockFetch([JSON.stringify({ text: 'Hi' }), '[DONE]'])

    const { result } = renderHook(() =>
      useAIGenerate({ blockType: 'heroBlock', onComplete })
    )

    await act(async () => {
      result.current.generate()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    // Even after 2s passes, state should be complete (not reverted)
    act(() => { jest.advanceTimersByTime(2001) })
    expect(result.current.state).toBe('complete')
  })

  it('reverts silently when the server sends [ERROR]', async () => {
    mockFetch([JSON.stringify({ text: 'partial' }), '[ERROR]'])

    const onComplete = jest.fn()
    const { result } = renderHook(() =>
      useAIGenerate({ blockType: 'heroBlock', onComplete })
    )

    await act(async () => {
      result.current.generate()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(result.current.state).toBe('idle')
    expect(onComplete).not.toHaveBeenCalled()
  })
})
