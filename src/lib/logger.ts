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
interface SerializedError {
  name: string
  message: string
  stack?: string
  [key: string]: unknown
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

/** Core error properties that are handled specially */
const CORE_ERROR_PROPS = new Set(['name', 'message', 'stack'])

/**
 * Serialize an error-like value into a normalized object with name, message, stack,
 * plus any custom enumerable properties (code, statusCode, errno, etc.)
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
    for (const key of Object.keys(obj)) {
      if (CORE_ERROR_PROPS.has(key)) continue

      try {
        const propValue = obj[key]

        // Skip functions
        if (typeof propValue === 'function') continue

        // Serialize the value appropriately
        if (propValue === null || propValue === undefined) {
          result[key] = propValue
        } else if (
          typeof propValue === 'string' ||
          typeof propValue === 'number' ||
          typeof propValue === 'boolean'
        ) {
          result[key] = propValue
        } else if (typeof propValue === 'object') {
          // For objects, try JSON serialization; fallback to string
          try {
            JSON.stringify(propValue)
            result[key] = propValue
          } catch {
            result[key] = String(propValue)
          }
        } else {
          // For other types (symbol, bigint), convert to string
          result[key] = String(propValue)
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

/** Common keys that may contain error-like values */
const ERROR_KEYS = new Set(['error', 'cause', 'lastError', 'originalError', 'innerError'])

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
