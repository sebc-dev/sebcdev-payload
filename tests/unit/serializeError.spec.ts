import { Readable } from 'stream'
import { describe, expect, it } from 'vitest'

import { ERROR_KEYS, serializeError } from '@/lib/logger'

describe('serializeError', () => {
  describe('basic error serialization', () => {
    it('should serialize a standard Error', () => {
      const error = new Error('Test error')
      const result = serializeError(error)

      expect(result.name).toBe('Error')
      expect(result.message).toBe('Test error')
      expect(result.stack).toBeDefined()
    })

    it('should serialize a string as an error', () => {
      const result = serializeError('Simple error message')

      expect(result.name).toBe('Error')
      expect(result.message).toBe('Simple error message')
    })

    it('should serialize error-like objects', () => {
      const errorLike = { name: 'CustomError', message: 'Something went wrong' }
      const result = serializeError(errorLike)

      expect(result.name).toBe('CustomError')
      expect(result.message).toBe('Something went wrong')
    })

    it('should preserve custom properties like code and statusCode', () => {
      const error = new Error('HTTP Error') as Error & { code: string; statusCode: number }
      error.code = 'ECONNREFUSED'
      error.statusCode = 500

      const result = serializeError(error)

      expect(result.code).toBe('ECONNREFUSED')
      expect(result.statusCode).toBe(500)
    })
  })

  describe('sensitive key filtering', () => {
    it('should filter out response property', () => {
      const error = new Error('API Error') as Error & { response: object }
      error.response = { status: 401, data: { token: 'secret' } }

      const result = serializeError(error)

      expect(result.response).toBeUndefined()
    })

    it('should filter out request property', () => {
      const error = new Error('Request failed') as Error & { request: object }
      error.request = { url: '/api/users', headers: { Authorization: 'Bearer token' } }

      const result = serializeError(error)

      expect(result.request).toBeUndefined()
    })

    it('should filter out config property', () => {
      const error = new Error('Axios error') as Error & { config: object }
      error.config = { baseURL: 'http://api.example.com', headers: {} }

      const result = serializeError(error)

      expect(result.config).toBeUndefined()
    })

    it('should filter out headers property', () => {
      const error = new Error('Header error') as Error & { headers: object }
      error.headers = { Authorization: 'Bearer secret-token', Cookie: 'session=abc' }

      const result = serializeError(error)

      expect(result.headers).toBeUndefined()
    })

    it('should filter out body property', () => {
      const error = new Error('Body error') as Error & { body: string }
      error.body = JSON.stringify({ password: 'secret123', email: 'user@test.com' })

      const result = serializeError(error)

      expect(result.body).toBeUndefined()
    })

    it('should filter out token property', () => {
      const error = new Error('Auth error') as Error & { token: string }
      error.token = 'REDACTED_TOKEN_EXAMPLE'

      const result = serializeError(error)

      expect(result.token).toBeUndefined()
    })

    it('should filter out password property', () => {
      const error = new Error('Validation error') as Error & { password: string }
      error.password = 'user-secret-password'

      const result = serializeError(error)

      expect(result.password).toBeUndefined()
    })

    it('should filter out auth property', () => {
      const error = new Error('Auth config error') as Error & { auth: object }
      error.auth = { username: 'admin', password: 'secret' }

      const result = serializeError(error)

      expect(result.auth).toBeUndefined()
    })

    it('should filter out context property', () => {
      const error = new Error('Context error') as Error & { context: object }
      error.context = { userId: 123, sessionData: { token: 'abc' } }

      const result = serializeError(error)

      expect(result.context).toBeUndefined()
    })

    it('should filter out raw property', () => {
      const error = new Error('Raw data error') as Error & { raw: string }
      error.raw = 'very large raw data...'

      const result = serializeError(error)

      expect(result.raw).toBeUndefined()
    })

    it('should filter out data property', () => {
      const error = new Error('Data error') as Error & { data: object }
      error.data = { sensitiveInfo: 'should not appear' }

      const result = serializeError(error)

      expect(result.data).toBeUndefined()
    })

    it('should filter multiple sensitive keys at once', () => {
      const error = new Error('Complex error') as Error & {
        response: object
        request: object
        config: object
        token: string
        code: string
      }
      error.response = { status: 500 }
      error.request = { url: '/api' }
      error.config = { timeout: 5000 }
      error.token = 'secret'
      error.code = 'ERR_NETWORK' // Non-sensitive, should be preserved

      const result = serializeError(error)

      expect(result.response).toBeUndefined()
      expect(result.request).toBeUndefined()
      expect(result.config).toBeUndefined()
      expect(result.token).toBeUndefined()
      expect(result.code).toBe('ERR_NETWORK')
    })
  })

  describe('value truncation', () => {
    it('should truncate long string values', () => {
      const longString = 'x'.repeat(1500)
      const error = new Error('Test') as Error & { longProp: string }
      error.longProp = longString

      const result = serializeError(error)

      expect(result.longProp).toHaveLength(1000 + '…[truncated]'.length)
      expect((result.longProp as string).endsWith('…[truncated]')).toBe(true)
    })

    it('should not truncate strings under 1000 characters', () => {
      const shortString = 'x'.repeat(500)
      const error = new Error('Test') as Error & { shortProp: string }
      error.shortProp = shortString

      const result = serializeError(error)

      expect(result.shortProp).toBe(shortString)
    })

    it('should truncate large objects', () => {
      const largeObject = { data: 'x'.repeat(1500) }
      const error = new Error('Test') as Error & { large: object }
      error.large = largeObject

      const result = serializeError(error)

      expect(result.large).toBe('[truncated object]')
    })

    it('should truncate large arrays', () => {
      const largeArray = Array(200).fill({ item: 'some data' })
      const error = new Error('Test') as Error & { items: unknown[] }
      error.items = largeArray

      const result = serializeError(error)

      expect(result.items).toBe('[truncated array]')
    })

    it('should preserve small objects', () => {
      const smallObject = { code: 'ERR', status: 404 }
      const error = new Error('Test') as Error & { details: object }
      error.details = smallObject

      const result = serializeError(error)

      expect(result.details).toEqual(smallObject)
    })
  })

  describe('type handling', () => {
    it('should skip function properties', () => {
      const error = new Error('Test') as Error & { fn: () => void; code: string }
      error.fn = () => console.log('test')
      error.code = 'TEST'

      const result = serializeError(error)

      expect(result.fn).toBeUndefined()
      expect(result.code).toBe('TEST')
    })

    it('should skip Buffer properties', () => {
      const error = new Error('Test') as Error & { buffer: Buffer; code: string }
      error.buffer = Buffer.from('sensitive binary data')
      error.code = 'BUFFER_ERR'

      const result = serializeError(error)

      expect(result.buffer).toBeUndefined()
      expect(result.code).toBe('BUFFER_ERR')
    })

    it('should skip Stream properties', () => {
      const error = new Error('Test') as Error & { stream: Readable; code: string }
      error.stream = new Readable()
      error.code = 'STREAM_ERR'

      const result = serializeError(error)

      expect(result.stream).toBeUndefined()
      expect(result.code).toBe('STREAM_ERR')
    })

    it('should handle circular references gracefully', () => {
      const circular: Record<string, unknown> = { name: 'circular' }
      circular.self = circular
      const error = new Error('Test') as Error & { circular: object }
      error.circular = circular

      const result = serializeError(error)

      expect(result.circular).toBe('[unserializable]')
    })

    it('should preserve null and undefined values', () => {
      const error = new Error('Test') as Error & { nullProp: null; undefinedProp: undefined }
      error.nullProp = null
      error.undefinedProp = undefined

      const result = serializeError(error)

      expect(result.nullProp).toBeNull()
      expect(result.undefinedProp).toBeUndefined()
    })

    it('should preserve boolean values', () => {
      const error = new Error('Test') as Error & { isRetryable: boolean }
      error.isRetryable = true

      const result = serializeError(error)

      expect(result.isRetryable).toBe(true)
    })

    it('should preserve numeric values', () => {
      const error = new Error('Test') as Error & { statusCode: number; retryAfter: number }
      error.statusCode = 429
      error.retryAfter = 60

      const result = serializeError(error)

      expect(result.statusCode).toBe(429)
      expect(result.retryAfter).toBe(60)
    })
  })

  describe('edge cases', () => {
    it('should handle errors with throwing getters', () => {
      const error = new Error('Test')
      Object.defineProperty(error, 'throwingProp', {
        get() {
          throw new Error('Getter throws')
        },
        enumerable: true,
      })

      // Should not throw
      const result = serializeError(error)

      expect(result.name).toBe('Error')
      expect(result.message).toBe('Test')
      expect(result.throwingProp).toBeUndefined()
    })

    it('should handle non-object/non-string values', () => {
      const result = serializeError(42)

      expect(result.name).toBe('Error')
      expect(result.message).toBe('42')
    })

    it('should handle null input', () => {
      const result = serializeError(null)

      expect(result.name).toBe('Error')
      expect(result.message).toBe('null')
    })
  })
})

describe('ERROR_KEYS', () => {
  describe('standard aliases', () => {
    it('should include "error" key', () => {
      expect(ERROR_KEYS.has('error')).toBe(true)
    })

    it('should include "err" alias', () => {
      expect(ERROR_KEYS.has('err')).toBe(true)
    })

    it('should include "e" alias', () => {
      expect(ERROR_KEYS.has('e')).toBe(true)
    })

    it('should include "exception" alias', () => {
      expect(ERROR_KEYS.has('exception')).toBe(true)
    })

    it('should include "cause" key', () => {
      expect(ERROR_KEYS.has('cause')).toBe(true)
    })
  })

  describe('nested/wrapped error aliases', () => {
    it('should include "lastError" key', () => {
      expect(ERROR_KEYS.has('lastError')).toBe(true)
    })

    it('should include "originalError" key', () => {
      expect(ERROR_KEYS.has('originalError')).toBe(true)
    })

    it('should include "innerError" key', () => {
      expect(ERROR_KEYS.has('innerError')).toBe(true)
    })

    it('should include "rootCause" key', () => {
      expect(ERROR_KEYS.has('rootCause')).toBe(true)
    })
  })

  describe('completeness', () => {
    it('should contain exactly 9 error key aliases', () => {
      expect(ERROR_KEYS.size).toBe(9)
    })

    it('should contain all documented aliases', () => {
      const expectedKeys = [
        'error',
        'err',
        'e',
        'exception',
        'cause',
        'lastError',
        'originalError',
        'innerError',
        'rootCause',
      ]

      for (const key of expectedKeys) {
        expect(ERROR_KEYS.has(key)).toBe(true)
      }
    })
  })
})
