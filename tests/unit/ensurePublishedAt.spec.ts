import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ensurePublishedAt } from '@/hooks/ensurePublishedAt'

describe('ensurePublishedAt hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should auto-populate publishedAt when status is published and publishedAt is missing', async () => {
    const result = await ensurePublishedAt({
      data: { status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.publishedAt).toBe('2024-01-15T10:30:00.000Z')
  })

  it('should not modify publishedAt when already set', async () => {
    const existingDate = '2023-12-01T08:00:00.000Z'

    const result = await ensurePublishedAt({
      data: { status: 'published', publishedAt: existingDate } as any,
      req: {} as any,
      operation: 'update',
      context: {},
    } as any)

    expect(result.publishedAt).toBe(existingDate)
  })

  it('should not set publishedAt for draft articles', async () => {
    const result = await ensurePublishedAt({
      data: { status: 'draft' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.publishedAt).toBeUndefined()
  })

  it('should not set publishedAt for archived articles', async () => {
    const result = await ensurePublishedAt({
      data: { status: 'archived' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.publishedAt).toBeUndefined()
  })

  it('should handle null data gracefully', async () => {
    const result = await ensurePublishedAt({
      data: null as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result).toBeNull()
  })

  it('should handle undefined data gracefully', async () => {
    const result = await ensurePublishedAt({
      data: undefined as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result).toBeUndefined()
  })
})
