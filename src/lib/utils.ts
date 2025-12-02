import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for optimal class handling.
 *
 * Features:
 * - Conditional classes via clsx
 * - Intelligent Tailwind class merging (last wins for conflicts)
 * - Type-safe with ClassValue
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-primary', className)
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
