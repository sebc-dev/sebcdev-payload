# Phase 3: Table of Contents Component - Environment Setup

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4

---

## Prerequisites

### Required Software

| Tool | Version | Verification Command |
|------|---------|---------------------|
| Node.js | >=18.18.0 | `node --version` |
| pnpm | >=8.0.0 | `pnpm --version` |
| Git | >=2.30.0 | `git --version` |

### Required Knowledge

- TypeScript generics and utility types
- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`)
- Intersection Observer API
- shadcn/ui component patterns
- Radix UI primitives (Sheet)
- CSS-in-JS via Tailwind

---

## Project Setup

### 1. Clone and Branch

```bash
# Ensure you're on the correct branch
git checkout feature/story-4.2-phase-3

# Pull latest changes
git pull origin feature/story-4.2-phase-3

# Verify branch
git branch --show-current
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify key dependencies
pnpm list @radix-ui/react-dialog lucide-react
```

### 3. Verify Development Environment

```bash
# TypeScript compilation
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Run existing tests
pnpm test:unit
```

---

## Dependencies Check

### Required Dependencies (Already Installed)

| Package | Purpose | Verify |
|---------|---------|--------|
| `@radix-ui/react-dialog` | Sheet component base | `pnpm list @radix-ui/react-dialog` |
| `lucide-react` | List icon | `pnpm list lucide-react` |
| `clsx` | Class merging | `pnpm list clsx` |
| `tailwind-merge` | Tailwind class merging | `pnpm list tailwind-merge` |

### Development Dependencies (Already Installed)

| Package | Purpose | Verify |
|---------|---------|--------|
| `vitest` | Unit testing | `pnpm list vitest` |
| `@testing-library/react` | Component testing | `pnpm list @testing-library/react` |
| `@testing-library/user-event` | User interaction testing | `pnpm list @testing-library/user-event` |
| `jsdom` | DOM environment | `pnpm list jsdom` |

---

## Required Files from Previous Phases

### Phase 1 Files (Required)

Verify these files exist from Phase 1:

```bash
# TOC types
ls src/lib/toc/types.ts

# TOC extraction function
ls src/lib/toc/extract-headings.ts

# Barrel export
ls src/lib/toc/index.ts
```

### Phase 2 Files (Reference)

Use as patterns (not direct dependencies):

```bash
# Hook pattern reference
ls src/hooks/use-reading-progress.ts

# Component pattern reference
ls src/components/articles/ReadingProgressBar.tsx
```

### shadcn/ui Components

Verify Sheet component exists:

```bash
# Sheet component (required for MobileTOC)
ls src/components/ui/sheet.tsx

# Button component (required for trigger)
ls src/components/ui/button.tsx
```

---

## Directory Structure

### Target Structure After Phase 3

```
src/
├── hooks/
│   ├── use-reading-progress.ts      # From Phase 2
│   └── use-active-section.ts        # NEW in this phase
├── components/
│   ├── ui/
│   │   ├── button.tsx               # Existing
│   │   └── sheet.tsx                # Existing
│   └── articles/
│       ├── ReadingProgressBar.tsx   # From Phase 2
│       ├── TOCLink.tsx              # NEW in this phase
│       ├── TableOfContents.tsx      # NEW in this phase
│       ├── MobileTOC.tsx            # NEW in this phase
│       └── index.ts                 # MODIFY in this phase
├── lib/
│   └── toc/
│       ├── types.ts                 # From Phase 1
│       ├── extract-headings.ts      # From Phase 1
│       ├── slugify.ts               # From Phase 1
│       └── index.ts                 # From Phase 1
tests/
└── unit/
    ├── hooks/
    │   ├── use-reading-progress.spec.ts  # From Phase 2
    │   └── use-active-section.spec.ts    # NEW in this phase
    └── components/
        └── articles/
            ├── ReadingProgressBar.spec.tsx  # From Phase 2
            ├── TOCLink.spec.tsx             # NEW in this phase
            ├── TableOfContents.spec.tsx     # NEW in this phase
            └── MobileTOC.spec.tsx           # NEW in this phase
```

### Create Directories (if needed)

```bash
# These should already exist from Phase 2
mkdir -p tests/unit/components/articles
```

---

## TypeScript Configuration

### Verify Path Aliases

In `tsconfig.json`, ensure these aliases are configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

### Verify Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## Testing Configuration

### Vitest Setup

Verify `vitest.config.ts` includes:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.spec.{ts,tsx}'],
  },
})
```

### Test Setup File

Verify `tests/setup.ts` includes:

```typescript
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

---

## IDE Setup

### VSCode Extensions (Recommended)

- **ESLint** - Linting integration
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript Nightly** - Latest TypeScript features

### VSCode Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## API Documentation

### Intersection Observer API

The `useActiveSection` hook uses the Intersection Observer API:

```typescript
// Basic usage
const observer = new IntersectionObserver(callback, {
  root: null,       // viewport
  rootMargin: '-80px 0px -60% 0px',  // trigger zone
  threshold: 0.3,   // 30% visible triggers
})

observer.observe(element)
observer.disconnect()
```

**Key concepts**:
- `rootMargin`: Negative top accounts for sticky header, negative bottom triggers when heading in top 40%
- `threshold`: How much of element must be visible
- `isIntersecting`: Whether element is currently in threshold zone

**Browser support**: All modern browsers (no polyfill needed)

### shadcn/ui Sheet

The `MobileTOC` uses shadcn/ui Sheet (wrapper around Radix UI Dialog):

```typescript
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// Usage
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Features used**:
- `side="right"`: Opens from right side
- `open`/`onOpenChange`: Controlled state
- Built-in focus trap and keyboard handling
- Built-in close button

---

## Development Workflow

### Start Development Server

```bash
# Start Next.js dev server
pnpm dev

# Open browser
open http://localhost:3000
```

### Run Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/hooks/use-active-section.spec.ts

# Run tests in watch mode
pnpm test:unit --watch
```

### Type Check

```bash
# Full TypeScript check
pnpm exec tsc --noEmit

# Watch mode
pnpm exec tsc --noEmit --watch
```

### Lint

```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

---

## Troubleshooting

### Common Issues

#### 1. IntersectionObserver not defined in tests

**Problem**: Tests fail with "IntersectionObserver is not defined"

**Solution**: Mock IntersectionObserver in test setup:

```typescript
beforeEach(() => {
  global.IntersectionObserver = vi.fn((callback) => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  }))
})
```

#### 2. matchMedia not defined in tests

**Problem**: Tests fail with "matchMedia is not a function"

**Solution**: Mock matchMedia in test setup:

```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

#### 3. Sheet tests failing

**Problem**: Sheet doesn't render in tests

**Solution**: Sheet uses portals. Use `waitFor` to wait for dialog to appear:

```typescript
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

#### 4. TypeScript path resolution errors

**Problem**: `Cannot find module '@/...'`

**Solution**: Ensure `vite-tsconfig-paths` is in vitest plugins:

```typescript
// vitest.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

---

## Quick Reference

### Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm test:unit` | Run unit tests |
| `pnpm exec tsc --noEmit` | Type check |
| `pnpm lint` | Run linter |
| `git status` | Check changes |
| `git add <files>` | Stage changes |
| `git commit -m "message"` | Create commit |

### Key Files

| File | Description |
|------|-------------|
| `src/lib/toc/types.ts` | TOCHeading interface |
| `src/components/ui/sheet.tsx` | Sheet component |
| `src/hooks/use-reading-progress.ts` | Pattern reference |
| `tests/setup.ts` | Test setup |

### Key Imports

```typescript
// TOC types
import type { TOCHeading, TOCData } from '@/lib/toc/types'

// UI components
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Icons
import { List } from 'lucide-react'

// Utilities
import { cn } from '@/lib/utils'
```

---

## Ready to Start

Verify everything is set up:

```bash
# Quick verification script
echo "=== Environment Check ===" && \
node --version && \
pnpm --version && \
git branch --show-current && \
pnpm exec tsc --noEmit && \
echo "=== All checks passed! ==="
```

If all checks pass, proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) to start Commit 1.

---

**Setup Guide Generated**: 2025-12-11
