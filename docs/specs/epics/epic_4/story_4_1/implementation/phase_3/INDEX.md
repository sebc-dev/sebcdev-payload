# Phase 3 - Code Block Syntax Highlighting

**Story**: 4.1 - Rendu Article & MDX
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 3 of 5
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy (5 commits) |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklists |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Dependencies and configuration |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation |

---

## Phase Overview

### Objective

Add syntax highlighting for code blocks with a solution compatible with Cloudflare Workers (Edge runtime). This phase transforms plain `<pre><code>` blocks into beautifully highlighted code with language indicators and copy-to-clipboard functionality.

### User Value

Developers reading technical articles will see:
- Color-coded syntax highlighting matching modern IDE themes
- Clear language indicators (JavaScript, TypeScript, Python, etc.)
- One-click code copying for quick usage
- Consistent dark theme matching the Design System

### Scope

**In Scope**:
- `CodeBlock` component with Shiki syntax highlighting
- `InlineCode` component for backtick code
- Shiki configuration optimized for Edge runtime
- `CopyButton` UI component
- Support for 10+ common programming languages
- Dark theme (github-dark or similar)
- Integration with existing serializer

**Out of Scope**:
- Line numbers (can be added later)
- Line highlighting (can be added later)
- Code diff highlighting
- Live code execution
- Image rendering (Phase 4)

---

## Technical Approach

### Why Shiki?

| Criteria | Shiki | Prism.js | Highlight.js |
|----------|-------|----------|--------------|
| Edge/Workers Compatible | Yes (WASM) | No (DOM) | No (DOM) |
| Build-time Support | Yes | Limited | Limited |
| TextMate Grammars | Yes (VS Code quality) | No | No |
| Bundle Size | ~100KB (web bundle) | ~30KB | ~50KB |
| Theme Quality | VS Code level | Good | Good |

**Decision**: Use Shiki with `shiki/bundle/web` for optimal Edge compatibility and VS Code-quality syntax highlighting.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Article Page (RSC)                     │
├─────────────────────────────────────────────────────────┤
│                      RichText                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    serialize.tsx                     ││
│  │  ┌───────────────────────────────────────────────┐  ││
│  │  │ case 'code': <CodeBlock node={...} />         │  ││
│  │  └───────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                     CodeBlock.tsx                        │
│  ┌─────────────────────────────────────────────────────┐│
│  │ - Extracts code from node                           ││
│  │ - Calls Shiki highlighter (build-time)              ││
│  │ - Renders highlighted HTML                          ││
│  │ - Includes CopyButton (client)                      ││
│  └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                     InlineCode.tsx                       │
│  ┌─────────────────────────────────────────────────────┐│
│  │ - Simple <code> with styling                        ││
│  │ - No syntax highlighting (inline text)              ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Lexical JSON contains "code" node with language property
2. serialize.tsx routes to CodeBlock component
3. CodeBlock extracts code text from children
4. Shiki highlights code (server-side, build-time)
5. HTML with <span> color classes is rendered
6. CopyButton (client component) handles clipboard
```

---

## Commits Summary

| # | Commit | Files | Lines | Duration |
|---|--------|-------|-------|----------|
| 1 | Shiki Configuration | 2 | ~80 | 30-45 min |
| 2 | CodeBlock Component | 2 | ~150 | 45-60 min |
| 3 | InlineCode Component | 2 | ~60 | 20-30 min |
| 4 | CopyButton Component | 2 | ~100 | 30-45 min |
| 5 | Integration & Tests | 3 | ~120 | 45-60 min |
| **Total** | | **11** | **~510** | **3-4 hours** |

---

## Dependencies

### Phase Dependencies

- **Phase 2** (Lexical Rendering): Must be complete
  - serializer.tsx exists and handles node routing
  - types.ts includes CodeNode interface
  - Current placeholder: `<pre><code>` for 'code' nodes

### Package Dependencies

```json
{
  "shiki": "^3.0.0"
}
```

### Existing Infrastructure

- `src/components/richtext/serialize.tsx` - Node router (to modify)
- `src/components/richtext/types.ts` - Type definitions (CodeNode exists)
- `src/components/ui/button.tsx` - shadcn/ui Button (for CopyButton)
- Design System colors and JetBrains Mono font

---

## Risk Assessment

### Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shiki bundle too large | Low | Medium | Use `shiki/bundle/web`, limit languages |
| Edge runtime issues | Low | High | Use build-time highlighting, test on Workers |
| Clipboard API unsupported | Very Low | Low | Feature detection, graceful degradation |
| Unknown language handling | Low | Low | Fallback to plain text |

### Contingency Plans

1. **If Shiki fails on Edge**: Use CSS-only highlighting or Prism.js fallback
2. **If bundle is too large**: Reduce language set to top 5 most common
3. **If copy fails**: Show manual "Select all" instruction

---

## Success Criteria

### Functional

- [ ] Code blocks render with syntax highlighting
- [ ] Language indicator shows above code block
- [ ] Copy button copies code to clipboard
- [ ] Inline code styled consistently
- [ ] Unknown languages render as plain text (no errors)

### Non-Functional

- [ ] Bundle size impact < 150KB
- [ ] No runtime errors on Cloudflare Workers
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Dark theme consistent with Design System

### Quality Gates

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint + Biome pass
- [ ] Build succeeds
- [ ] Manual visual inspection

---

## Supported Languages

### Priority 1 (Must Have)

| Language | File Extensions | Usage |
|----------|-----------------|-------|
| JavaScript | .js | Web development |
| TypeScript | .ts, .tsx | Primary stack |
| JSON | .json | Config files |
| Bash | .sh, .bash | Commands |
| HTML | .html | Markup |
| CSS | .css | Styling |

### Priority 2 (Should Have)

| Language | File Extensions | Usage |
|----------|-----------------|-------|
| Python | .py | AI/ML examples |
| Go | .go | Backend examples |
| Rust | .rs | Systems examples |
| SQL | .sql | Database queries |
| YAML | .yml, .yaml | Config files |

### Priority 3 (Nice to Have)

| Language | File Extensions | Usage |
|----------|-----------------|-------|
| Markdown | .md | Documentation |
| GraphQL | .graphql | API queries |
| Diff | .diff | Code changes |

---

## File Structure

After implementation:

```
src/components/
├── richtext/
│   ├── nodes/
│   │   ├── CodeBlock.tsx      (new)
│   │   ├── InlineCode.tsx     (new)
│   │   ├── Heading.tsx
│   │   ├── Paragraph.tsx
│   │   ├── List.tsx
│   │   ├── Quote.tsx
│   │   ├── Link.tsx
│   │   └── index.ts           (modified)
│   ├── shiki-config.ts        (new)
│   ├── serialize.tsx          (modified)
│   ├── types.ts
│   ├── RichText.tsx
│   └── index.ts
└── ui/
    └── copy-button.tsx        (new)

tests/unit/components/richtext/
├── nodes.spec.tsx             (modified - add CodeBlock tests)
└── code-block.spec.tsx        (new - dedicated tests)
```

---

## References

### Documentation

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Overall story planning
- [Story 4.1 Spec](../../story_4.1.md) - Story requirements
- [UX/UI Spec](../../../../UX_UI_Spec.md) - Design requirements

### External

- [Shiki Documentation](https://shiki.style/)
- [Shiki Bundle Guide](https://shiki.style/guide/bundles)
- [Payload Lexical Code Block](https://payloadcms.com/docs/rich-text/lexical)

### Related Code

- Phase 2 serializer: `src/components/richtext/serialize.tsx`
- Design System: `src/app/globals.css`
- shadcn/ui Button: `src/components/ui/button.tsx`

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for dependencies
2. **Follow** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) commit by commit
3. **Check** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) before each commit
4. **Review** with [guides/REVIEW.md](./guides/REVIEW.md)
5. **Test** following [guides/TESTING.md](./guides/TESTING.md)
6. **Validate** using [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Phase Created**: 2025-12-10
**Last Updated**: 2025-12-10
**Generated by**: phase-doc-generator skill
