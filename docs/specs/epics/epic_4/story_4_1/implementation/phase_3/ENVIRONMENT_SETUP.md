# Phase 3 - Environment Setup

Configure your development environment for implementing syntax highlighting with Shiki.

---

## Prerequisites

### Required Tools

| Tool | Version | Verify Command |
|------|---------|----------------|
| Node.js | 18+ | `node --version` |
| pnpm | 8+ | `pnpm --version` |
| Git | 2.30+ | `git --version` |

### Required Knowledge

- TypeScript generics and async functions
- React Server Components (RSC)
- React Client Components ("use client")
- Tailwind CSS utility classes
- Basic understanding of AST/JSON tree traversal

---

## Phase Dependencies

### Phase 2 Must Be Complete

Before starting Phase 3, verify:

```bash
# Check serializer exists
ls src/components/richtext/serialize.tsx

# Check types exist
ls src/components/richtext/types.ts

# Verify code node type is defined
grep "CodeNode" src/components/richtext/types.ts
```

**Expected Output**:

```
src/components/richtext/serialize.tsx
src/components/richtext/types.ts
export interface CodeNode extends BaseLexicalNode {
```

### Existing Code Structure

Verify these files exist:

```
src/components/richtext/
├── RichText.tsx          ✓ Main component
├── serialize.tsx         ✓ Node serializer (will modify)
├── types.ts              ✓ Type definitions
├── index.ts              ✓ Barrel exports
└── nodes/
    ├── Paragraph.tsx     ✓
    ├── Heading.tsx       ✓
    ├── List.tsx          ✓
    ├── Quote.tsx         ✓
    ├── Link.tsx          ✓
    └── index.ts          ✓
```

---

## Package Installation

### Install Shiki

```bash
pnpm add shiki
```

### Verify Installation

```bash
# Check package is installed
pnpm list shiki

# Expected output:
# shiki 3.x.x (or similar version)
```

### Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| `shiki` | ^3.0.0 | Syntax highlighting (Edge compatible) |

**Note**: Shiki 3.x uses WASM internally and is compatible with Edge runtimes including Cloudflare Workers.

---

## Project Configuration

### TypeScript Configuration

No changes needed. Verify `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind Configuration

No changes needed for Phase 3. Design System colors are already defined:

- `bg-muted` - Code block background
- `text-muted-foreground` - Secondary text
- `border-border` - Border color
- `text-foreground` - Primary text

### ESLint Configuration

No changes needed. Standard rules apply.

---

## Development Environment

### Start Development Server

```bash
# Clean start (recommended)
pnpm devsafe

# Or regular start
pnpm dev
```

### Verify Server Running

```bash
# Check server is accessible
curl -s http://localhost:3000 | head -20
```

### Test Data

Ensure you have articles with code blocks in the database:

```bash
# Seed database if needed
pnpm seed
```

Or manually create an article in Payload Admin with code blocks:

1. Go to `/admin/collections/articles`
2. Create/Edit an article
3. Add a code block in the rich text editor
4. Select a language (JavaScript, TypeScript, etc.)
5. Add sample code

---

## File Structure After Setup

After completing Phase 3 setup, you'll have:

```
src/components/
├── richtext/
│   ├── nodes/
│   │   ├── CodeBlock.tsx      (new - Commit 2)
│   │   ├── InlineCode.tsx     (new - Commit 3, optional)
│   │   ├── Heading.tsx
│   │   ├── Paragraph.tsx
│   │   ├── List.tsx
│   │   ├── Quote.tsx
│   │   ├── Link.tsx
│   │   └── index.ts           (modified)
│   ├── shiki-config.ts        (new - Commit 1)
│   ├── serialize.tsx          (modified - Commit 5)
│   ├── types.ts
│   ├── RichText.tsx
│   └── index.ts
└── ui/
    └── copy-button.tsx        (new - Commit 4)

tests/unit/components/richtext/
├── nodes.spec.tsx             (existing)
└── code-block.spec.tsx        (new - Commit 5)
```

---

## Shiki Bundle Selection

### Why `shiki/bundle/web`?

Shiki offers multiple bundles:

| Bundle | Size | Environment | Languages |
|--------|------|-------------|-----------|
| `shiki` | ~2MB | Node.js | All |
| `shiki/bundle/web` | ~500KB | Browser/Edge | Common |
| `shiki/bundle/full` | ~2MB | All | All |

**Decision**: Use `shiki/bundle/web` for:

- Smaller bundle size
- Edge runtime compatibility
- Contains all common languages

### Import Pattern

```typescript
// Correct (Edge compatible)
import { createHighlighter } from 'shiki/bundle/web'

// Avoid (too large, Node.js specific)
import { createHighlighter } from 'shiki'
```

---

## Lucide Icons

### Verify Installation

```bash
pnpm list lucide-react
```

Icons needed for CopyButton:

- `Copy` - Copy icon
- `Check` - Success checkmark

Already installed (used elsewhere in project).

---

## Verification Commands

### Type Checking

```bash
pnpm exec tsc --noEmit
```

### Linting

```bash
pnpm lint
```

### Unit Tests

```bash
pnpm test:unit
```

### Full Build

```bash
pnpm build
```

### All Checks

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build
```

---

## Troubleshooting

### Common Issues

#### Issue: Shiki WASM Loading Fails

**Symptom**: Error about WASM module loading

**Solution**: Ensure using `shiki/bundle/web` import:

```typescript
// Correct
import { createHighlighter } from 'shiki/bundle/web'
```

#### Issue: Module Not Found

**Symptom**: Cannot find module 'shiki'

**Solution**: Reinstall packages:

```bash
pnpm install
```

#### Issue: TypeScript Errors

**Symptom**: Type errors after importing Shiki

**Solution**: Check TypeScript version and Shiki types:

```bash
pnpm exec tsc --version
# Should be 5.x
```

#### Issue: Async Component Errors

**Symptom**: "Component is not a function" or similar

**Solution**: Ensure CodeBlock is async and properly awaited:

```typescript
// Correct
export async function CodeBlock({ node }: Props) {
  const highlighter = await getHighlighter()
  // ...
}
```

---

## IDE Setup

### VS Code Extensions

Recommended extensions:

- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **ESLint** - Linting integration
- **Prettier** - Formatting

### Code Snippets

Add to `.vscode/richtext.code-snippets`:

```json
{
  "Rich Text Node Component": {
    "prefix": "rtnode",
    "body": [
      "import type { ${1:Node}Node } from '../types'",
      "",
      "interface ${1:Node}Props {",
      "  node: ${1:Node}Node",
      "}",
      "",
      "export function ${1:Node}({ node }: ${1:Node}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

---

## Ready to Start?

### Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Phase 2 complete (serializer exists)
- [ ] Shiki package installed
- [ ] Development server starts
- [ ] Test data available (articles with code)

### Next Step

Proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) and start with Commit 1.

---

**Setup Guide Generated**: 2025-12-10
