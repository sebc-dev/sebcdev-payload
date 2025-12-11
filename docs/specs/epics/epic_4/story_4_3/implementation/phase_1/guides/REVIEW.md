# Code Review Guide - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3

---

## Review Overview

This phase involves 3 commits that establish the foundation for Live Preview functionality. Each commit should be reviewable in approximately 15-30 minutes.

---

## Commit-by-Commit Review

### Commit 1: Package Installation

**Focus**: Dependency management and compatibility

#### Checklist

- [ ] **Package Version**
  - Is `@payloadcms/live-preview-react` version compatible with Payload 3.65.x?
  - Check: `pnpm list @payloadcms/live-preview-react`

- [ ] **Lock File**
  - Is `pnpm-lock.yaml` updated correctly?
  - No unexpected dependency changes?

- [ ] **Peer Dependencies**
  - Any peer dependency warnings?
  - Are React 19 and Next.js 15 compatible?

- [ ] **No Side Effects**
  - Does the package introduce security vulnerabilities?
  - Check: `pnpm audit` (no high/critical issues)

#### Review Questions

1. Is the package version pinned appropriately (^3.x vs exact)?
2. Are there any duplicate packages in the dependency tree?
3. Does the package support Edge runtime (Cloudflare Workers)?

---

### Commit 2: Collection Configuration

**Focus**: Payload configuration correctness and type safety

#### Checklist

- [ ] **Type Safety**
  - Does TypeScript compile without errors?
  - Are `data` and `locale` parameters typed correctly?
  - Is the return type correct (`string` or `null`)?

- [ ] **Configuration Structure**
  ```typescript
  livePreview: {
    url: ({ data, locale }) => string | '',
    breakpoints: Array<{ name, width, height, label }>
  }
  ```

- [ ] **URL Generation Logic**
  - Handles missing slug gracefully (returns empty string)
  - Uses fallback locale ('fr') when undefined
  - Uses environment variable with fallback

- [ ] **Breakpoints**
  - Mobile: 375x667 (reasonable for iPhone SE)
  - Tablet: 768x1024 (reasonable for iPad)
  - Desktop: 1440x900 (reasonable for laptop)

- [ ] **No Breaking Changes**
  - Existing admin config preserved (`useAsTitle`, `defaultColumns`, `group`)
  - No changes to fields or hooks
  - Access control unchanged

#### Code Review Points

```typescript
// GOOD: Fallback handling
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const previewLocale = locale || 'fr'

// GOOD: Early return for missing slug
if (!slug) return ''

// GOOD: Type-safe breakpoints
breakpoints: [
  { name: 'mobile', width: 375, height: 667, label: 'Mobile' },
  // ...
]
```

#### Review Questions

1. Is the URL format correct for the project's routing structure?
2. Are breakpoints aligned with the project's responsive design?
3. Is the locale fallback appropriate for this project (FR is primary)?

---

### Commit 3: Environment Variable

**Focus**: Security and documentation

#### Checklist

- [ ] **Documentation Quality**
  - Is the purpose of the variable clear?
  - Is the expected value format documented?
  - Are environment-specific values noted?

- [ ] **Security**
  - Variable only contains public domain URL
  - No secrets or tokens exposed
  - Safe to document in `.env.example`

- [ ] **Naming Convention**
  - `NEXT_PUBLIC_` prefix is correct for client-accessible vars
  - Variable name is descriptive

- [ ] **No Sensitive Data Committed**
  - `.env` is NOT committed (in `.gitignore`)
  - Only `.env.example` is committed

#### Review Questions

1. Is the variable name consistent with project conventions?
2. Is the documentation sufficient for new developers?
3. Are production values documented separately (not in code)?

---

## General Review Criteria

### Code Quality

| Criterion | Expected |
|-----------|----------|
| TypeScript | No `any` types, proper interfaces |
| Formatting | Follows Prettier config |
| Linting | No ESLint errors |
| Comments | Clear, not excessive |

### Payload Best Practices

| Practice | Verification |
|----------|--------------|
| Config structure | Follows Payload documentation |
| Type imports | Uses `type` imports where applicable |
| Edge compatibility | No Node.js-only APIs |

### Project Conventions

| Convention | Check |
|------------|-------|
| Gitmoji | Commit messages use correct emojis |
| File structure | Files in correct locations |
| Import paths | Uses `@/` alias |

---

## Review Commands

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Build verification
pnpm build

# Dependency audit
pnpm audit
```

---

## Approval Criteria

### Must Pass

- [ ] TypeScript compiles without errors
- [ ] No ESLint errors
- [ ] Build succeeds
- [ ] Admin panel loads
- [ ] Live Preview panel visible

### Should Pass

- [ ] No ESLint warnings
- [ ] No peer dependency warnings
- [ ] Documentation is clear

### Nice to Have

- [ ] Inline comments for complex logic
- [ ] Consistent code style

---

## Common Issues to Watch For

### Package Installation

| Issue | Impact | Resolution |
|-------|--------|------------|
| Version mismatch | Runtime errors | Pin to compatible version |
| Missing peer deps | Build warnings | Install missing packages |
| Duplicate packages | Bundle size | Dedupe with pnpm |

### Collection Configuration

| Issue | Impact | Resolution |
|-------|--------|------------|
| Wrong type signature | TypeScript error | Match Payload types |
| Hardcoded URLs | Environment issues | Use env vars |
| Missing null checks | Runtime errors | Add guards |

### Environment Variables

| Issue | Impact | Resolution |
|-------|--------|------------|
| Committed secrets | Security risk | Remove, rotate |
| Missing docs | Onboarding friction | Document in .env.example |
| Wrong prefix | Client access issues | Use NEXT_PUBLIC_ |

---

## Post-Review Actions

### If Approved

1. Merge commit(s)
2. Update tracking documents
3. Proceed to Phase 2

### If Changes Requested

1. Address feedback
2. Push updated commits
3. Re-request review

### If Rejected

1. Discuss concerns
2. Revise approach if needed
3. Start fresh if necessary

---

## Reviewer Notes Template

```markdown
## Review: Phase 1, Commit [X]

### Status: [Approved / Changes Requested / Rejected]

### Checklist
- [ ] TypeScript compiles
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Manual verification done

### Comments
[Add specific feedback here]

### Changes Required (if any)
1. [Change 1]
2. [Change 2]

### Approved By
[Reviewer Name] - [Date]
```

---

**Review Guide Created**: 2025-12-11
**Guide Version**: 1.0
