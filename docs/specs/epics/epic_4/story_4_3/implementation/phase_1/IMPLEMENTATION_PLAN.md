# Implementation Plan - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3
**Commits**: 3 atomic commits
**Estimated Duration**: 1-1.5 hours

---

## Phase Goal

Install the Live Preview package and configure the Articles collection to enable the split view editing experience in Payload Admin.

---

## Atomic Commit Strategy

### Why Atomic Commits?

- **Easier Review**: Each commit focuses on one specific change
- **Safe Rollback**: Revert individual commits without breaking everything
- **Progressive Validation**: Types and tests check at each step
- **Clear History**: Git history tells the implementation story

### Commit Overview

```
Commit 1: Install package          [15 min]  ████░░░░░░░░░░░░ 25%
Commit 2: Configure collection     [30 min]  ████████░░░░░░░░ 50%
Commit 3: Add environment vars     [15 min]  ████████████░░░░ 75%
Testing & Validation               [30 min]  ████████████████ 100%
```

---

## Commit 1: Install @payloadcms/live-preview-react Package

### Objective

Add the Live Preview React package as a project dependency.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | MODIFY | Add dependency |
| `pnpm-lock.yaml` | MODIFY | Auto-generated lock file |

### Implementation Steps

1. **Install Package**
   ```bash
   pnpm add @payloadcms/live-preview-react
   ```

2. **Verify Installation**
   ```bash
   pnpm list @payloadcms/live-preview-react
   ```

3. **Check TypeScript**
   ```bash
   pnpm exec tsc --noEmit
   ```

### Expected package.json Change

```diff
{
  "dependencies": {
+   "@payloadcms/live-preview-react": "^3.x.x",
    "@payloadcms/db-sqlite": "...",
    ...
  }
}
```

### Verification Checklist

- [ ] Package appears in `node_modules/@payloadcms/live-preview-react`
- [ ] No peer dependency warnings
- [ ] TypeScript compiles without errors
- [ ] Dev server starts: `pnpm dev`

### Commit Message

```
:package: feat(deps): install @payloadcms/live-preview-react

Add Payload CMS Live Preview package for real-time article
preview functionality in the admin panel.

Ref: Story 4.3 - Live Preview (TA1)
```

### Rollback Instructions

```bash
pnpm remove @payloadcms/live-preview-react
```

---

## Commit 2: Add livePreview Configuration to Articles Collection

### Objective

Configure the Articles collection with Live Preview URL generation and responsive breakpoints.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `src/collections/Articles.ts` | MODIFY | Add `livePreview` to admin config |

### Implementation Steps

1. **Open Articles Collection**
   ```
   src/collections/Articles.ts
   ```

2. **Add livePreview Configuration**

   Add to the `admin` section (after line 48):

   ```typescript
   admin: {
     useAsTitle: 'title',
     defaultColumns: ['title', 'status', 'complexity', 'publishedAt'],
     group: 'Content',
     // NEW: Live Preview configuration for real-time article preview
     livePreview: {
       url: ({ data, locale }) => {
         const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
         const previewLocale = locale || 'fr'
         const slug = data?.slug || ''

         // Return null if no slug to disable preview for new articles
         if (!slug) return ''

         return `${baseUrl}/${previewLocale}/articles/${slug}`
       },
       breakpoints: [
         { name: 'mobile', width: 375, height: 667, label: 'Mobile' },
         { name: 'tablet', width: 768, height: 1024, label: 'Tablet' },
         { name: 'desktop', width: 1440, height: 900, label: 'Desktop' },
       ],
     },
   },
   ```

3. **Verify TypeScript Types**
   ```bash
   pnpm exec tsc --noEmit
   ```

### Code Context

The livePreview configuration should be added within the existing `admin` object:

```typescript
// src/collections/Articles.ts
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { ... },
  access: { ... },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'complexity', 'publishedAt'],
    group: 'Content',
    // ADD livePreview HERE
    livePreview: {
      url: ({ data, locale }) => { ... },
      breakpoints: [ ... ],
    },
  },
  hooks: { ... },
  fields: [ ... ],
}
```

### URL Generation Logic

| Input | Output |
|-------|--------|
| `locale='fr', slug='mon-article'` | `http://localhost:3000/fr/articles/mon-article` |
| `locale='en', slug='my-article'` | `http://localhost:3000/en/articles/my-article` |
| `locale=undefined, slug='test'` | `http://localhost:3000/fr/articles/test` (fallback) |
| `slug=''` or `undefined` | `''` (empty, disables preview) |

### Breakpoint Rationale

| Breakpoint | Width | Height | Device |
|------------|-------|--------|--------|
| Mobile | 375px | 667px | iPhone SE/8 |
| Tablet | 768px | 1024px | iPad |
| Desktop | 1440px | 900px | Standard laptop |

### Verification Checklist

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Build succeeds: `pnpm build`
- [ ] Dev server starts: `pnpm dev`
- [ ] Admin panel loads at `/admin`
- [ ] Live Preview panel appears when editing an article

### Commit Message

```
:sparkles: feat(articles): add Live Preview configuration

Configure Articles collection with livePreview settings:
- Bilingual URL generation (FR/EN locales)
- Responsive breakpoints (mobile/tablet/desktop)
- Fallback handling for missing slug

Ref: Story 4.3 - Live Preview (TA2)
```

### Rollback Instructions

Remove the `livePreview` block from the admin configuration in `src/collections/Articles.ts`.

---

## Commit 3: Add NEXT_PUBLIC_SERVER_URL Environment Variable

### Objective

Document and configure the environment variable needed for Live Preview URL generation.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `.env.example` | MODIFY | Document new env var |
| `.env` | MODIFY | Add local dev value |

### Implementation Steps

1. **Update .env.example**

   Add documentation for the new variable:

   ```bash
   # Live Preview Configuration
   # Base URL for Live Preview iframe (used in Payload Admin)
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

2. **Update .env (local development)**

   Add the actual value:

   ```bash
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. **Verify Environment Loading**
   ```bash
   pnpm dev
   # Check console for any env-related errors
   ```

### Environment Variable Details

| Variable | Purpose | Dev Value | Prod Value |
|----------|---------|-----------|------------|
| `NEXT_PUBLIC_SERVER_URL` | Base URL for preview URLs | `http://localhost:3000` | `https://sebc.dev` |

### Why NEXT_PUBLIC_ Prefix?

The `NEXT_PUBLIC_` prefix makes this variable available to:
- Server-side code (where it's used in the collection config)
- Client-side code (if needed for future features)

This is a public value (just the domain) so exposing it is safe.

### Verification Checklist

- [ ] `.env.example` updated with documentation
- [ ] `.env` has the local value
- [ ] Dev server starts without errors
- [ ] Preview URL includes correct base URL

### Commit Message

```
:wrench: chore(env): add NEXT_PUBLIC_SERVER_URL for Live Preview

Add environment variable for Live Preview URL generation:
- Document in .env.example
- Set local dev value in .env
- Required for bilingual preview URL construction

Ref: Story 4.3 - Live Preview
```

### Rollback Instructions

1. Remove the `NEXT_PUBLIC_SERVER_URL` line from `.env.example`
2. Remove the `NEXT_PUBLIC_SERVER_URL` line from `.env`
3. Update `src/collections/Articles.ts` to use hardcoded fallback only

---

## Post-Implementation Validation

### Quick Verification (5 minutes)

```bash
# 1. TypeScript check
pnpm exec tsc --noEmit

# 2. Build check
pnpm build

# 3. Start dev server
pnpm dev

# 4. Open admin panel
# Navigate to: http://localhost:3000/admin

# 5. Edit an article
# Navigate to: http://localhost:3000/admin/collections/articles
# Click on any article

# 6. Verify Live Preview panel
# - Split view should be visible
# - Preview iframe should show article URL
# - Breakpoint selector should be visible
```

### Full Validation

See [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) for complete validation steps.

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Package not found | Install failed | Run `pnpm install` again |
| Type errors in livePreview | Wrong config structure | Check Payload types |
| Preview panel not showing | Collection not reloaded | Restart dev server |
| Empty preview URL | Missing slug | Ensure article has a slug |
| Wrong locale in URL | Locale not passed | Check admin locale setting |

### Debug Commands

```bash
# Check package installation
pnpm list @payloadcms/live-preview-react

# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SERVER_URL)"

# Verbose TypeScript check
pnpm exec tsc --noEmit --listFiles | grep Articles
```

---

## Dependencies

### This Phase Depends On

- Payload CMS 3.65.x installed
- Articles collection exists
- Next.js 15 app router configured

### Future Phases Depend On

- **Phase 2**: Uses the installed package for `RefreshRouteOnSave` component
- **Phase 3**: Uses the configured preview URL for iframe display

---

## Summary

| Metric | Value |
|--------|-------|
| Total Commits | 3 |
| Files Changed | 4 |
| Lines Added | ~25 |
| Estimated Time | 1-1.5 hours |
| Risk Level | Low |

### Completion Criteria

- [ ] All 3 commits completed
- [ ] TypeScript compiles
- [ ] Build succeeds
- [ ] Live Preview panel visible in admin
- [ ] Preview URL correct with locale
- [ ] Breakpoints functional

---

**Plan Created**: 2025-12-11
**Plan Version**: 1.0
