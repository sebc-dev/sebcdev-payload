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

/**
 * Format log entry with timestamp and structured context
 */
function formatLogEntry(level: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  if (context && Object.keys(context).length > 0) {
    // Serialize error objects specially
    const serializedContext = { ...context }
    if (context.error instanceof Error) {
      serializedContext.error = {
        name: context.error.name,
        message: context.error.message,
        stack: context.error.stack,
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
