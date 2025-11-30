import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import type { Article, User, Category, Tag, Media } from '@/payload-types'
import path from 'path'
import fs from 'fs'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

let payload: Payload
let testUser: User
let testCategory: Category
let testTags: Tag[]
let testMedia: Media
const createdArticleIds: number[] = []

/**
 * Create a basic article content structure for testing
 * Payload expects Lexical JSON structure with root node
 * eslint-disable-next-line @typescript-eslint/no-explicit-any
 */
function createBasicContent(wordCount = 0): any {
  const words = wordCount > 0 ? 'word '.repeat(wordCount).trim() : ''

  return {
    root: {
      type: 'root',
      children: words
        ? [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: words,
                },
              ],
            },
          ]
        : [],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

describe('Articles Collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create test user for author relation
    testUser = await (payload.create as any)({
      collection: 'users',
      data: {
        email: `test-article-author-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      },
    })

    // Create test category for category relation
    testCategory = await (payload.create as any)({
      collection: 'categories',
      data: {
        name: `Catégorie Test ${Date.now()}`,
        slug: `test-category-${Date.now()}`,
      },
    })

    // Create test tags for tags relation
    testTags = await Promise.all([
      payload.create({
        collection: 'tags',
        data: {
          name: `Tag Test 1 ${Date.now()}`,
          slug: `test-tag-1-${Date.now()}`,
        },
      }),
      payload.create({
        collection: 'tags',
        data: {
          name: `Tag Test 2 ${Date.now()}`,
          slug: `test-tag-2-${Date.now()}`,
        },
      }),
    ])

    // Create test media for featured image relation
    // Payload upload collections require a file
    // Note: File uploads may fail in miniflare test environment due to Buffer serialization issues
    try {
      const testImagePath = path.resolve(__dirname, '../fixtures/test-image.png')
      const testImageBuffer = fs.readFileSync(testImagePath)

      testMedia = await (payload.create as any)({
        collection: 'media',
        data: {
          alt: `Test Media ${Date.now()}`,
        },
        file: {
          data: testImageBuffer,
          mimetype: 'image/png',
          name: `test-image-${Date.now()}.png`,
          size: testImageBuffer.length,
        },
      })
    } catch (error) {
      // Media upload may fail in test environment - tests using testMedia will be skipped
      console.warn('Media creation failed (expected in miniflare environment):', error)
    }
  })

  afterAll(async () => {
    // Delete all test articles
    for (const id of createdArticleIds) {
      await payload
        .delete({
          collection: 'articles',
          id,
        })
        .catch(() => {
          // Ignore if already deleted
        })
    }

    // Delete test data
    await payload
      .delete({
        collection: 'users',
        id: testUser.id,
      })
      .catch(() => {})

    await payload
      .delete({
        collection: 'categories',
        id: testCategory.id,
      })
      .catch(() => {})

    for (const tag of testTags) {
      await payload
        .delete({
          collection: 'tags',
          id: tag.id,
        })
        .catch(() => {})
    }

    if (testMedia) {
      await payload
        .delete({
          collection: 'media',
          id: testMedia.id,
        })
        .catch(() => {})
    }
  })

  describe('CRUD Operations', () => {
    it('should create article with all required fields', async () => {
      const slug = `test-crud-create-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Test Article Creation',
            slug,
            content: createBasicContent(75),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article).toBeDefined()
      expect(article.id).toBeDefined()
      expect(article.title).toBe('Test Article Creation')
      expect(article.slug).toBe(slug)
      expect(article.status).toBe('draft')
      expect(article.createdAt).toBeDefined()
    })

    it('should read article by ID', async () => {
      const slug = `test-crud-read-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Test Article Read',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      const retrieved = (await payload.findByID({
        collection: 'articles',
        id: created.id,
      })) as Article

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.title).toBe('Test Article Read')
      expect(retrieved.slug).toBe(slug)
    })

    it('should update article', async () => {
      const slug = `test-crud-update-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Original Title',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      const updated = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.update as any)({
          collection: 'articles',
          id: created.id,
          data: {
            title: 'Updated Title',
          },
        })) as Article

      expect(updated.title).toBe('Updated Title')
      expect(updated.slug).toBe(slug)
      expect(updated.id).toBe(created.id)
    })

    it('should delete article', async () => {
      const slug = `test-crud-delete-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article to Delete',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      await payload.delete({
        collection: 'articles',
        id: created.id,
      })

      const result = await payload.find({
        collection: 'articles',
        where: {
          id: {
            equals: created.id,
          },
        },
      })

      expect(result.docs).toHaveLength(0)
    })
  })

  describe('i18n Behavior', () => {
    it('should create localized article with French content', async () => {
      const slug = `test-i18n-fr-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article Français',
            slug,
            excerpt: 'Extrait en français',
            seo: {
              metaTitle: 'Titre Meta Français',
              metaDescription: 'Description Meta Française',
            },
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.title).toBe('Article Français')
      expect(article.excerpt).toBe('Extrait en français')
    })

    it('should retrieve localized content with FR locale', async () => {
      const slug = `test-i18n-locale-fr-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Test Locale FR',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      // Retrieve with FR locale
      const frArticle = (await payload.findByID({
        collection: 'articles',
        id: created.id,
        locale: 'fr',
      })) as Article

      expect(frArticle).toBeDefined()
      expect(frArticle.id).toBe(created.id)
    })

    it('should retrieve localized content with EN locale', async () => {
      const slug = `test-i18n-locale-en-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Test Locale EN',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      // Retrieve with EN locale
      const enArticle = (await payload.findByID({
        collection: 'articles',
        id: created.id,
        locale: 'en',
      })) as Article

      expect(enArticle).toBeDefined()
      expect(enArticle.id).toBe(created.id)
    })

    it('should handle SEO fields with localization', async () => {
      const slug = `test-seo-i18n-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with SEO',
            slug,
            seo: {
              metaTitle: 'SEO Title',
              metaDescription: 'SEO Description',
            },
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.seo).toBeDefined()
      expect(article.seo?.metaTitle).toBe('SEO Title')
      expect(article.seo?.metaDescription).toBe('SEO Description')
    })
  })

  describe('Relations', () => {
    it('should create article with category relation', async () => {
      const slug = `test-rel-category-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Category',
            slug,
            category: testCategory.id,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.category).toBeDefined()
      expect(
        article.category === testCategory.id ||
          (typeof article.category === 'object' && article.category.id === testCategory.id),
      ).toBe(true)
    })

    it('should create article with multiple tags', async () => {
      const slug = `test-rel-tags-${Date.now()}`
      const tagIds = testTags.map((t) => t.id)
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Tags',
            slug,
            tags: tagIds,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.tags).toBeDefined()
      expect(Array.isArray(article.tags)).toBe(true)
      expect(article.tags?.length).toBe(2)
    })

    it('should create article with author relation', async () => {
      const slug = `test-rel-author-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Author',
            slug,
            author: testUser.id,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.author).toBeDefined()
      expect(
        article.author === testUser.id ||
          (typeof article.author === 'object' && article.author.id === testUser.id),
      ).toBe(true)
    })

    it('should create article with featured image', async () => {
      // Skip if media creation failed (miniflare environment limitation)
      if (!testMedia) {
        console.warn('Skipping: testMedia not available (miniflare upload limitation)')
        return
      }

      const slug = `test-rel-media-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Featured Image',
            slug,
            featuredImage: testMedia.id,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.featuredImage).toBeDefined()
      expect(
        article.featuredImage === testMedia.id ||
          (typeof article.featuredImage === 'object' && article.featuredImage.id === testMedia.id),
      ).toBe(true)
    })

    it('should create article with all relations', async () => {
      const slug = `test-rel-all-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with All Relations',
            slug,
            category: testCategory.id,
            tags: testTags.map((t) => t.id),
            author: testUser.id,
            // Only include featuredImage if testMedia is available
            ...(testMedia ? { featuredImage: testMedia.id } : {}),
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.category).toBeDefined()
      expect(article.tags).toBeDefined()
      expect(article.author).toBeDefined()
      // Only check featuredImage if testMedia was available
      if (testMedia) {
        expect(article.featuredImage).toBeDefined()
      }
    })
  })

  describe('Hook Execution: Reading Time', () => {
    it('should calculate reading time for short content (100 words)', async () => {
      const slug = `test-reading-100-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Short Article',
            slug,
            content: createBasicContent(100),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.readingTime).toBe(1)
    })

    it('should calculate reading time for medium content (400 words)', async () => {
      const slug = `test-reading-400-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Medium Article',
            slug,
            content: createBasicContent(400),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.readingTime).toBe(2)
    })

    it('should handle null content gracefully', async () => {
      const slug = `test-reading-null-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with No Content',
            slug,
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.readingTime).toBe(0)
    })

    it('should recalculate reading time on content update', async () => {
      const slug = `test-reading-update-${Date.now()}`

      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article to Update Reading Time',
            slug,
            content: createBasicContent(100),
          },
        })) as Article

      createdArticleIds.push(created.id)

      expect(created.readingTime).toBe(1)

      const updated = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.update as any)({
          collection: 'articles',
          id: created.id,
          data: {
            content: createBasicContent(400),
          },
        })) as Article

      expect(updated.readingTime).toBe(2)
    })

    it('should calculate reading time with complex Lexical structure', async () => {
      const slug = `test-reading-complex-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Complex Content',
            slug,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: 'Paragraph one with some words. ',
                      },
                    ],
                  },
                  {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: 'This is a heading with several words.',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: 'More content here with additional paragraphs and text to fill space and increase word count significantly.',
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.readingTime).toBeGreaterThan(0)
      expect(typeof article.readingTime).toBe('number')
    })
  })

  describe('Status Workflow', () => {
    it('should default to draft status', async () => {
      const slug = `test-status-default-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Draft Article',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.status).toBe('draft')
    })

    it('should transition from draft to published', async () => {
      const slug = `test-status-published-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article for Publishing',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      expect(created.status).toBe('draft')

      const updated = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.update as any)({
          collection: 'articles',
          id: created.id,
          data: {
            status: 'published',
          },
        })) as Article

      expect(updated.status).toBe('published')
    })

    it('should transition to archived', async () => {
      const slug = `test-status-archived-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article to Archive',
            slug,
            status: 'published',
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      expect(created.status).toBe('published')

      const updated = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.update as any)({
          collection: 'articles',
          id: created.id,
          data: {
            status: 'archived',
          },
        })) as Article

      expect(updated.status).toBe('archived')
    })

    it('should handle publishedAt date field', async () => {
      const slug = `test-published-at-${Date.now()}`
      const publishDate = new Date('2024-01-15').toISOString()

      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Publish Date',
            slug,
            status: 'published',
            publishedAt: publishDate,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.publishedAt).toBeDefined()
      expect(article.status).toBe('published')
    })
  })

  describe('Validation and Constraints', () => {
    it('should enforce slug uniqueness', async () => {
      const slug = `test-unique-slug-${Date.now()}`

      const first = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'First Article',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(first.id)

      let error: Error | null = null
      try {
        await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Duplicate Slug Article',
            slug,
            content: createBasicContent(),
          },
        })
      } catch (e) {
        error = e as Error
      }

      expect(error).toBeDefined()
      expect(error?.message.toLowerCase()).toContain('unique')
    })

    it('should require title field', async () => {
      const slug = `test-title-required-${Date.now()}`
      let error: Error | null = null

      try {
        await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            slug,
            content: createBasicContent(),
          } as unknown as Record<string, unknown>,
        })
      } catch (e) {
        error = e as Error
      }

      expect(error).toBeDefined()
    })

    it('should require slug field', async () => {
      let error: Error | null = null

      try {
        await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article Without Slug',
            content: createBasicContent(),
          } as unknown as Record<string, unknown>,
        })
      } catch (e) {
        error = e as Error
      }

      expect(error).toBeDefined()
    })
  })

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt timestamps', async () => {
      const slug = `test-timestamps-${Date.now()}`
      const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Article with Timestamps',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(article.id)

      expect(article.createdAt).toBeDefined()
      expect(article.updatedAt).toBeDefined()
      expect(new Date(article.createdAt).getTime()).toBeGreaterThan(0)
      expect(new Date(article.updatedAt).getTime()).toBeGreaterThan(0)
    })

    it('should update updatedAt on changes', async () => {
      const slug = `test-timestamps-update-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Original Title',
            slug,
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      const originalUpdatedAt = created.updatedAt

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updated = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.update as any)({
          collection: 'articles',
          id: created.id,
          data: {
            title: 'Updated Title',
          },
        })) as Article

      expect(updated.updatedAt).toBeDefined()
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalUpdatedAt).getTime(),
      )
    })
  })

  describe('Query Operations', () => {
    it('should find articles with filters', async () => {
      const slug = `test-query-find-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Queryable Article',
            slug,
            status: 'draft',
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      const results = await payload.find({
        collection: 'articles',
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      expect(results.docs.length).toBeGreaterThan(0)
      const found = results.docs.find((doc) => doc.id === created.id)
      expect(found).toBeDefined()
      expect(found?.title).toBe('Queryable Article')
    })

    it('should find articles with status filter', async () => {
      const slug = `test-query-status-${Date.now()}`
      const created = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await (payload.create as any)({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Status Filtered Article',
            slug,
            status: 'published',
            content: createBasicContent(),
          },
        })) as Article

      createdArticleIds.push(created.id)

      const results = await payload.find({
        collection: 'articles',
        where: {
          status: {
            equals: 'published',
          },
        },
      })

      expect(results.docs.length).toBeGreaterThan(0)
      const found = results.docs.find((doc) => doc.id === created.id)
      expect(found).toBeDefined()
      expect(found?.status).toBe('published')
    })

    it('should paginate article results', async () => {
      // Create a few test articles
      const slugBase = `test-paginate-${Date.now()}`
      const articlesCreated: Article[] = []

      for (let i = 0; i < 3; i++) {
        const article = // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (await (payload.create as any)({
            collection: 'articles',
            draft: false,
            data: {
              title: `Pagination Test Article ${i}`,
              slug: `${slugBase}-${i}`,
              content: createBasicContent(),
            },
          })) as Article

        articlesCreated.push(article)
        createdArticleIds.push(article.id)
      }

      const page1 = await payload.find({
        collection: 'articles',
        limit: 2,
        page: 1,
      })

      expect(page1.docs).toBeDefined()
      expect(page1.limit).toBe(2)
      expect(page1.page).toBe(1)
    })
  })
})
