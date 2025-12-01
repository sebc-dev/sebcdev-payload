/**
 * Structured logging adapter
 *
 * Wraps console methods to accept structured metadata payloads.
 * Can be upgraded to use a full logging library (pino, winston) later.
 *
 * @example
 * logger.error('Failed to process', { userId: 123, error: err })
 * logger.info('Request completed', { duration: 150, status: 200 })
 */

export interface LogContext {
  [key: string]: unknown
}

export interface Logger {
  error: (message: string, context?: LogContext) => void
  warn: (message: string, context?: LogContext) => void
  info: (message: string, context?: LogContext) => void
  debug: (message: string, context?: LogContext) => void
}

/** Serialized error structure for JSON output (allows custom properties) */
export interface SerializedError {
  name: string
  message: string
  stack?: string
  [key: string]: unknown
}

/**
 * Check if a value is error-like (Error instance, object with error properties, or string)
 * Handles cross-realm errors and plain error-like objects
 *
 * @internal Exported for testing purposes
 */
export function isErrorLike(value: unknown): boolean {
  if (value instanceof Error) {
    return true
  }

  if (typeof value === 'string') {
    return true
  }

  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Check for error-like properties (at least message or name)
    return typeof obj.message === 'string' || typeof obj.name === 'string'
  }

  return false
}

/** Core error properties that are handled specially */
const CORE_ERROR_PROPS = new Set(['name', 'message', 'stack'])

/** Blacklist of keys that may contain sensitive or large data */
const SENSITIVE_KEYS = new Set([
  'response',
  'request',
  'config',
  'context',
  'headers',
  'body',
  'token',
  'password',
  'auth',
  'raw',
  'data',
])

/** Maximum length for string values before truncation */
const MAX_STRING_LENGTH = 1000

/** Truncation suffix */
const TRUNCATION_SUFFIX = '…[truncated]'

/**
 * Check if a value is a Buffer or Stream-like object
 *
 * @internal Exported for testing purposes
 */
export function isBufferOrStream(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  // Check for Buffer
  if (typeof obj.constructor === 'function' && obj.constructor.name === 'Buffer') return true
  // Check for Stream (has pipe method)
  if (typeof obj.pipe === 'function') return true
  // Check for ReadableStream/WritableStream
  if (
    typeof obj.constructor === 'function' &&
    (obj.constructor.name === 'ReadableStream' ||
      obj.constructor.name === 'WritableStream' ||
      obj.constructor.name === 'TransformStream')
  )
    return true
  return false
}

/**
 * Truncate a string value if it exceeds the max length
 */
function truncateString(value: string): string {
  if (value.length <= MAX_STRING_LENGTH) return value
  return value.slice(0, MAX_STRING_LENGTH) + TRUNCATION_SUFFIX
}

/**
 * Safely serialize a property value with size limits
 * Returns undefined if the value should be skipped
 */
function serializePropertyValue(value: unknown): unknown {
  // Skip functions
  if (typeof value === 'function') return undefined

  // Skip Buffer/Stream types
  if (isBufferOrStream(value)) return undefined

  // Handle null/undefined
  if (value === null || value === undefined) return value

  // Handle strings with truncation
  if (typeof value === 'string') return truncateString(value)

  // Handle primitives
  if (typeof value === 'number' || typeof value === 'boolean') return value

  // Handle objects/arrays
  if (typeof value === 'object') {
    try {
      const serialized = JSON.stringify(value)
      if (serialized.length > MAX_STRING_LENGTH) {
        return Array.isArray(value) ? '[truncated array]' : '[truncated object]'
      }
      return value
    } catch {
      return '[unserializable]'
    }
  }

  // For other types (symbol, bigint), convert to string
  try {
    return String(value)
  } catch {
    return '[unserializable]'
  }
}

/**
 * Serialize an error-like value into a normalized object with name, message, stack,
 * plus any custom enumerable properties (code, statusCode, errno, etc.)
 * Filters sensitive keys and truncates large values to prevent data leaks.
 *
 * @internal Exported for testing purposes
 */
export function serializeError(value: unknown): SerializedError {
  // Handle string errors
  if (typeof value === 'string') {
    return { name: 'Error', message: value }
  }

  // Handle Error instances and error-like objects
  if (value !== null && typeof value === 'object') {
    const result: SerializedError = {
      name: 'Error',
      message: 'Unknown error',
    }

    const obj = value as Record<string, unknown>

    // Extract core properties directly (wrapped in try/catch for throwing getters)
    try {
      if (typeof obj.name === 'string') result.name = obj.name
    } catch {
      /* ignore */
    }
    try {
      if (typeof obj.message === 'string') result.message = obj.message
    } catch {
      /* ignore */
    }
    try {
      if (typeof obj.stack === 'string') result.stack = obj.stack
    } catch {
      /* ignore */
    }

    // Copy custom enumerable properties (code, statusCode, errno, etc.)
    // Filters sensitive keys and truncates large values
    for (const key of Object.keys(obj)) {
      if (CORE_ERROR_PROPS.has(key)) continue
      if (SENSITIVE_KEYS.has(key)) continue

      try {
        const propValue = obj[key]
        const serialized = serializePropertyValue(propValue)

        // Skip if serializePropertyValue returned undefined (function, Buffer, Stream)
        if (serialized !== undefined) {
          result[key] = serialized
        }
      } catch {
        // Ignore properties that throw on access (getters)
      }
    }

    return result
  }

  // Fallback for unexpected types
  return { name: 'Error', message: String(value) }
}

/**
 * Common keys that may contain error-like values.
 * These keys trigger automatic serialization via serializeError() when
 * the value is error-like, ensuring proper JSON output instead of empty objects.
 *
 * Includes:
 * - Standard: error, err, e, exception, cause
 * - Nested/wrapped: lastError, originalError, innerError, rootCause
 *
 * @internal Exported for testing purposes
 */
export const ERROR_KEYS = new Set([
  'error',
  'err',
  'e',
  'exception',
  'cause',
  'lastError',
  'originalError',
  'innerError',
  'rootCause',
])

/**
 * Format log entry with timestamp and structured context
 */
function formatLogEntry(level: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  if (context && Object.keys(context).length > 0) {
    // Serialize error-like values in context
    const serializedContext: LogContext = {}

    for (const key of Object.keys(context)) {
      const value = context[key]
      if (ERROR_KEYS.has(key) && isErrorLike(value)) {
        serializedContext[key] = serializeError(value)
      } else {
        serializedContext[key] = value
      }
    }

    return `${base} ${JSON.stringify(serializedContext)}`
  }

  return base
}

/**
 * Default console-based logger with structured output
 */
export const logger: Logger = {
  error: (message: string, context?: LogContext) => {
    console.error(formatLogEntry('error', message, context))
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatLogEntry('warn', message, context))
  },

  info: (message: string, context?: LogContext) => {
    console.info(formatLogEntry('info', message, context))
  },

  debug: (message: string, context?: LogContext) => {
    console.debug(formatLogEntry('debug', message, context))
  },
}
