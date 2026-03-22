import { reducer } from '@/hooks/useOptimisticBlocks'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

const hero: PageBlock = {
  _type: 'heroBlock',
  _key: 'key-hero',
  title: 'Original Title',
  subtitle: 'Original Subtitle',
}

const cta: PageBlock = {
  _type: 'callToActionBlock',
  _key: 'key-cta',
  heading: 'Get Started',
  buttonLabel: 'Sign Up',
}

const initial: PageBlock[] = [hero, cta]

describe('useOptimisticBlocks reducer', () => {
  describe('REORDER', () => {
    it('moves item from index 0 to index 1', () => {
      const result = reducer(initial, { type: 'REORDER', from: 0, to: 1 })
      expect(result[0]._key).toBe('key-cta')
      expect(result[1]._key).toBe('key-hero')
    })

    it('is a no-op when from === to', () => {
      const result = reducer(initial, { type: 'REORDER', from: 0, to: 0 })
      expect(result[0]._key).toBe('key-hero')
      expect(result[1]._key).toBe('key-cta')
    })

    it('does not mutate the original array', () => {
      reducer(initial, { type: 'REORDER', from: 0, to: 1 })
      expect(initial[0]._key).toBe('key-hero')
    })
  })

  describe('UPDATE_FIELD', () => {
    it('patches the matching block', () => {
      const result = reducer(initial, {
        type: 'UPDATE_FIELD',
        key: 'key-hero',
        patch: { title: 'New Title' },
      })
      const updated = result.find((b) => b._key === 'key-hero') as typeof hero
      expect(updated.title).toBe('New Title')
    })

    it('preserves unpatched fields on the updated block', () => {
      const result = reducer(initial, {
        type: 'UPDATE_FIELD',
        key: 'key-hero',
        patch: { title: 'New Title' },
      })
      const updated = result.find((b) => b._key === 'key-hero') as typeof hero
      expect(updated.subtitle).toBe('Original Subtitle')
    })

    it('does not affect other blocks', () => {
      const result = reducer(initial, {
        type: 'UPDATE_FIELD',
        key: 'key-hero',
        patch: { title: 'New Title' },
      })
      const untouched = result.find((b) => b._key === 'key-cta') as typeof cta
      expect(untouched.heading).toBe('Get Started')
    })

    it('is a no-op when key does not match any block', () => {
      const result = reducer(initial, {
        type: 'UPDATE_FIELD',
        key: 'nonexistent',
        patch: { title: 'Ghost' },
      })
      expect(result).toEqual(initial)
    })
  })

  describe('REVERT', () => {
    it('replaces state with the provided snapshot', () => {
      const modified = reducer(initial, {
        type: 'UPDATE_FIELD',
        key: 'key-hero',
        patch: { title: 'Modified' },
      })
      const reverted = reducer(modified, { type: 'REVERT', snapshot: initial })
      expect(reverted).toEqual(initial)
    })

    it('restores an empty snapshot', () => {
      const result = reducer(initial, { type: 'REVERT', snapshot: [] })
      expect(result).toEqual([])
    })
  })
})
