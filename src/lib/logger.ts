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

/** Serialized error structure for JSON output */
interface SerializedError {
  name: string
  message: string
  stack?: string
}

/**
 * Check if a value is error-like (Error instance, object with error properties, or string)
 * Handles cross-realm errors and plain error-like objects
 */
function isErrorLike(value: unknown): boolean {
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

/**
 * Serialize an error-like value into a normalized { name, message, stack } object
 * Uses Object.getOwnPropertyNames to capture non-enumerable properties
 */
function serializeError(value: unknown): SerializedError {
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

    // Use Object.getOwnPropertyNames to capture non-enumerable properties like stack
    const props = Object.getOwnPropertyNames(value)
    const obj = value as Record<string, unknown>

    for (const prop of props) {
      if (prop === 'name' && typeof obj.name === 'string') {
        result.name = obj.name
      } else if (prop === 'message' && typeof obj.message === 'string') {
        result.message = obj.message
      } else if (prop === 'stack' && typeof obj.stack === 'string') {
        result.stack = obj.stack
      }
    }

    return result
  }

  // Fallback for unexpected types
  return { name: 'Error', message: String(value) }
}

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
      if (key === 'error' && isErrorLike(value)) {
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
