# Phase 2: Reading Progress Bar - Environment Setup

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4

---

## Prerequisites

Before starting implementation, ensure your environment meets these requirements.

### Required Tools

| Tool | Minimum Version | Verify Command |
|------|-----------------|----------------|
| Node.js | 20.x | `node --version` |
| pnpm | 8.x | `pnpm --version` |
| Git | 2.x | `git --version` |

### Project Dependencies

This phase uses existing project dependencies. No new packages required.

**Existing dependencies used**:
- `react` (19.x) - Core React hooks
- `@testing-library/react` - Testing utilities
- `vitest` - Test runner
- `tailwindcss` - Styling utilities

---

## Environment Verification

### Step 1: Verify Branch

```bash
# Ensure you're on the correct branch
git branch --show-current
# Expected: feature/story-4.2-phase-2 (or similar)

# If not, create or checkout the branch
git checkout -b feature/story-4.2-phase-2
```

### Step 2: Install Dependencies

```bash
# Ensure all dependencies are installed
pnpm install
```

### Step 3: Verify Build

```bash
# Run TypeScript check
pnpm exec tsc --noEmit

# Run linting
pnpm lint

# Run existing tests
pnpm test:unit
```

All commands should pass without errors.

### Step 4: Verify Development Server

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000 to verify the app loads
```

---

## Project Structure Reference

### Relevant Directories

```
src/
├── hooks/                          # Custom React hooks
│   └── use-reading-progress.ts     # [NEW] Progress tracking hook
├── components/
│   └── articles/
│       ├── index.ts                # [MODIFY] Barrel exports
│       └── ReadingProgressBar.tsx  # [NEW] Progress bar component
└── lib/
    └── utils.ts                    # cn() utility for classnames

tests/
└── unit/
    ├── hooks/
    │   └── use-reading-progress.spec.ts    # [NEW] Hook tests
    └── components/
        └── articles/
            └── ReadingProgressBar.spec.tsx # [NEW] Component tests
```

### Key Files to Reference

| File | Purpose | Why Reference |
|------|---------|---------------|
| `src/hooks/use-media-query.ts` | Existing hook example | Pattern reference |
| `src/components/articles/ArticleHeader.tsx` | Existing article component | Style patterns |
| `src/lib/utils.ts` | cn() utility | Classname merging |
| `tailwind.config.ts` | Design tokens | Color variables |

---

## Development Environment

### Recommended VS Code Extensions

- **ESLint** - Linting integration
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Class autocompletion
- **TypeScript Vue Plugin (Volar)** - Enhanced TS support

### TypeScript Settings

The project uses strict TypeScript. Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Path Aliases

```typescript
// Available aliases
import { useReadingProgress } from '@/hooks/use-reading-progress'
import { ReadingProgressBar } from '@/components/articles'
import { cn } from '@/lib/utils'
```

---

## Testing Environment

### Vitest Configuration

Tests run with Vitest in jsdom environment. Key configuration:

```typescript
// vitest.config.ts (relevant parts)
{
  environment: 'jsdom',
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    reporter: ['text', 'html'],
    threshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
      }
    }
  }
}
```

### Running Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/hooks/use-reading-progress.spec.ts

# Run tests in watch mode
pnpm test:unit --watch

# Run tests with coverage
pnpm test:unit --coverage
```

### Test Utilities Available

```typescript
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
```

---

## Design System Reference

### Colors

```css
/* Primary (teal accent) - for progress bar fill */
--primary: 14B8A6;

/* Muted - for progress bar track */
--muted: varies by theme;
```

### Tailwind Classes

**Progress Bar Styling**:
```tsx
// Container
'fixed top-0 left-0 right-0 z-50 h-[3px] bg-muted/30'

// Fill
'h-full bg-primary transition-[width] duration-150 ease-linear motion-reduce:transition-none'
```

### Height Standard

- Progress bar height: `3px` (visible but not intrusive)
- Z-index: `50` (above content, below modals)

---

## Browser Testing

### Supported Browsers

| Browser | Version | Test Priority |
|---------|---------|---------------|
| Chrome | Latest | High |
| Firefox | Latest | High |
| Safari | Latest | Medium |
| Edge | Latest | Medium |

### APIs Used

| API | Browser Support | Polyfill Needed |
|-----|-----------------|-----------------|
| `requestAnimationFrame` | All modern | No |
| `getBoundingClientRect()` | All modern | No |
| `passive event listeners` | All modern | No |
| CSS `motion-reduce` | All modern | No |

---

## Common Setup Issues

### Issue: TypeScript Path Alias Not Working

**Symptom**: Import errors with `@/` prefix

**Solution**:
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: Tests Fail with DOM Errors

**Symptom**: `document is not defined` errors

**Solution**: Ensure test file uses correct environment:
```typescript
// Add at top of test file if needed
// @vitest-environment jsdom
```

### Issue: Tailwind Classes Not Applied

**Symptom**: Styles not showing in development

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Issue: Hook Returns Stale Values

**Symptom**: Progress doesn't update on scroll

**Solution**: Check that:
1. `passive: true` is set on event listener
2. `requestAnimationFrame` callback is executing
3. Cleanup function is not removing listener too early

---

## Pre-Implementation Checklist

Before starting Commit 1, verify:

- [ ] On correct feature branch
- [ ] `pnpm install` completed
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test:unit` passes
- [ ] Development server starts without errors
- [ ] You've read IMPLEMENTATION_PLAN.md
- [ ] You've read COMMIT_CHECKLIST.md

---

## Quick Reference Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production

# Quality Checks
pnpm exec tsc --noEmit      # Type checking
pnpm lint                   # Linting

# Testing
pnpm test:unit              # All unit tests
pnpm test:unit --watch      # Watch mode
pnpm test:unit --coverage   # With coverage

# Git
git status                  # Check changes
git diff                    # View changes
git add <file>              # Stage file
git commit -m "message"     # Commit
```

---

## Next Steps

Once environment is verified:

1. **Read** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for commit strategy
2. **Follow** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for implementation
3. **Apply** [guides/TESTING.md](./guides/TESTING.md) for testing patterns
4. **Complete** [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) when done

---

**Environment Setup Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
