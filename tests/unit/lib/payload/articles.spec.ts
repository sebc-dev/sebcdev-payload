/**
 * Unit tests for article fetch utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Article } from '@/payload-types'

// Mock payload module
const mockFind = vi.fn()
vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve({ find: mockFind })),
}))

// Mock payload config
vi.mock('@payload-config', () => ({
  default: {},
}))

// Import after mocks are set up
import { getArticleBySlug } from '@/lib/payload/articles'

describe('getArticleBySlug', () => {
  const mockArticle: Partial<Article> = {
    id: 1,
    title: 'Test Article',
    slug: 'test-article',
    status: 'published',
    complexity: 'intermediate',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns article when found', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    const result = await getArticleBySlug('test-article', 'fr')

    expect(result.article).toEqual(mockArticle)
    expect(result.error).toBeUndefined()
  })

  it('returns null when not found', async () => {
    mockFind.mockResolvedValueOnce({ docs: [] })

    const result = await getArticleBySlug('non-existent', 'fr')

    expect(result.article).toBeNull()
    expect(result.error).toBeUndefined()
  })

  it('handles errors gracefully', async () => {
    const errorMessage = 'Database connection failed'
    mockFind.mockRejectedValueOnce(new Error(errorMessage))

    const result = await getArticleBySlug('test-article', 'fr')

    expect(result.article).toBeNull()
    expect(result.error).toBe(errorMessage)
  })

  it('handles non-Error exceptions by converting to string', async () => {
    mockFind.mockRejectedValueOnce('string error')

    const result = await getArticleBySlug('test-article', 'fr')

    expect(result.article).toBeNull()
    expect(result.error).toBe('string error')
  })

  it('early-returns for invalid slug without calling payload.find', async () => {
    const result = await getArticleBySlug('INVALID--SLUG', 'fr')

    expect(result.article).toBeNull()
    expect(result.error).toBeUndefined()
    expect(mockFind).not.toHaveBeenCalled()
  })

  it('uses correct locale parameter', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('test-article', 'en')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'en',
      }),
    )
  })

  it('queries the articles collection', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('test-article', 'fr')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'articles',
      }),
    )
  })

  it('filters by published status', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('test-article', 'fr')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { equals: 'published' },
        }),
      }),
    )
  })

  it('filters by slug', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('my-slug', 'fr')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          slug: { equals: 'my-slug' },
        }),
      }),
    )
  })

  it('uses depth 2 for relations', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('test-article', 'fr')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        depth: 2,
      }),
    )
  })

  it('limits results to 1', async () => {
    mockFind.mockResolvedValueOnce({ docs: [mockArticle] })

    await getArticleBySlug('test-article', 'fr')

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 1,
      }),
    )
  })
})
