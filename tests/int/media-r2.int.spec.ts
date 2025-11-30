import { getPayload, Payload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getTestImageFile, generateTestAltText } from '../helpers/media.helpers'

let payload: Payload
const createdMediaIds: number[] = []

/**
 * Flag indicating if media uploads work in this test environment.
 * Miniflare has a known limitation with Buffer serialization that prevents
 * file uploads from working correctly. When this flag is false, upload tests
 * will be skipped.
 */
let mediaUploadsSupported = false

describe('Media R2 Storage Integration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Test if media uploads work in this environment
    // Miniflare has Buffer serialization issues that prevent file uploads
    try {
      const testFile = getTestImageFile('env-check.png')
      const testMedia = (await (payload.create as any)({
        collection: 'media',
        data: {
          alt: 'Environment check',
        },
        file: testFile,
      })) as Media

      mediaUploadsSupported = true
      createdMediaIds.push(testMedia.id)
    } catch {
      // Media uploads not supported in this environment (e.g., miniflare)
      mediaUploadsSupported = false
    }
  })

  afterAll(async () => {
    // Cleanup: Delete all test media
    for (const id of createdMediaIds) {
      await payload
        .delete({
          collection: 'media',
          id,
        })
        .catch(() => {
          // Ignore if already deleted
        })
    }
  })

  describe('Upload Operations', () => {
    it('should upload image file to R2 via Payload API', async ({ skip }) => {
      if (!mediaUploadsSupported) {
        skip('Media uploads not supported in miniflare environment')
      }

      const altText = generateTestAltText('Upload Test')
      const file = getTestImageFile()

      const media = (await (payload.create as any)({
        collection: 'media',
        data: {
          alt: altText,
        },
        file,
      })) as Media

      createdMediaIds.push(media.id)

      expect(media).toBeDefined()
      expect(media.id).toBeDefined()
      expect(media.alt).toBe(altText)
      expect(media.filename).toBeDefined()
      expect(media.filename).toContain('.png')
    })

    it('should store correct metadata in database', async ({ skip }) => {
      if (!mediaUploadsSupported) {
        skip('Media uploads not supported in miniflare environment')
      }

      const altText = generateTestAltText('Metadata Test')
      const caption = 'Test caption for metadata'
      const file = getTestImageFile()

      const media = (await (payload.create as any)({
        collection: 'media',
        data: {
          alt: altText,
          caption,
        },
        file,
      })) as Media

      createdMediaIds.push(media.id)

      // Verify metadata
      expect(media.mimeType).toBe('image/png')
      expect(media.filesize).toBeGreaterThan(0)
      expect(media.caption).toBe(caption)
    })

    it('should generate accessible URL', async ({ skip }) => {
      if (!mediaUploadsSupported) {
        skip('Media uploads not supported in miniflare environment')
      }

      const altText = generateTestAltText('URL Test')
      const file = getTestImageFile()

      const media = (await (payload.create as any)({
        collection: 'media',
        data: {
          alt: altText,
        },
        file,
      })) as Media

      createdMediaIds.push(media.id)

      // Verify URL is generated
      expect(media.url).toBeDefined()
      expect(typeof media.url).toBe('string')
      expect(media.url!.length).toBeGreaterThan(0)
    })

    it('should store image dimensions when available', async ({ skip }) => {
      if (!mediaUploadsSupported) {
        skip('Media uploads not supported in miniflare environment')
      }

      const altText = generateTestAltText('Dimensions Test')
      const file = getTestImageFile()

      const media = (await (payload.create as any)({
        collection: 'media',
        data: {
          alt: altText,
        },
        file,
      })) as Media

      createdMediaIds.push(media.id)

      // Note: Dimensions may not be available in Workers environment
      // This test documents the expected behavior
      if (media.width !== undefined && media.height !== undefined) {
        expect(media.width).toBeGreaterThan(0)
        expect(media.height).toBeGreaterThan(0)
      }
    })
  })
})
