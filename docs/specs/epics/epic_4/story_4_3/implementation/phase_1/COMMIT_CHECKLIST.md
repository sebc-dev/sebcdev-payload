# Commit Checklist - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3
**Total Commits**: 3

---

## How to Use This Checklist

1. Work through commits sequentially (1 -> 2 -> 3)
2. Check each item as you complete it
3. Run verification commands before committing
4. Use the provided commit messages (gitmoji format)
5. Mark commit as complete before moving to the next

---

## Commit 1: Install @payloadcms/live-preview-react Package

### Pre-Implementation

- [ ] Ensure dev server is stopped
- [ ] Verify you're on the correct branch: `git branch --show-current`
- [ ] Pull latest changes: `git pull origin main`

### Implementation Steps

- [ ] **Step 1.1**: Install the package
  ```bash
  pnpm add @payloadcms/live-preview-react
  ```

- [ ] **Step 1.2**: Verify installation
  ```bash
  pnpm list @payloadcms/live-preview-react
  ```
  Expected output:
  ```
  @payloadcms/live-preview-react 3.x.x
  ```

- [ ] **Step 1.3**: Check for peer dependency warnings
  - No critical warnings should appear
  - Minor warnings about optional deps are acceptable

### Verification

- [ ] **V1.1**: TypeScript compiles
  ```bash
  pnpm exec tsc --noEmit
  ```
  Expected: No errors

- [ ] **V1.2**: Dev server starts
  ```bash
  pnpm dev
  ```
  Expected: Server starts on port 3000

- [ ] **V1.3**: Admin panel loads
  Navigate to: `http://localhost:3000/admin`
  Expected: Login page or admin dashboard

### Commit

- [ ] Stage changes:
  ```bash
  git add package.json pnpm-lock.yaml
  ```

- [ ] Create commit:
  ```bash
  git commit -m "$(cat <<'EOF'
  :package: feat(deps): install @payloadcms/live-preview-react

  Add Payload CMS Live Preview package for real-time article
  preview functionality in the admin panel.

  Ref: Story 4.3 - Live Preview (TA1)

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
  EOF
  )"
  ```

### Post-Commit

- [ ] Verify commit: `git log -1 --oneline`
- [ ] Commit 1 COMPLETE

---

## Commit 2: Add livePreview Configuration to Articles Collection

### Pre-Implementation

- [ ] Commit 1 is complete
- [ ] Dev server is running
- [ ] Admin panel is accessible

### Implementation Steps

- [ ] **Step 2.1**: Open the Articles collection file
  ```
  src/collections/Articles.ts
  ```

- [ ] **Step 2.2**: Locate the `admin` object (around line 44-48)
  ```typescript
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'complexity', 'publishedAt'],
    group: 'Content',
  },
  ```

- [ ] **Step 2.3**: Add livePreview configuration after `group: 'Content',`
  ```typescript
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'complexity', 'publishedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data, locale }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const previewLocale = locale || 'fr'
        const slug = data?.slug || ''

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

- [ ] **Step 2.4**: Save the file

### Verification

- [ ] **V2.1**: TypeScript compiles
  ```bash
  pnpm exec tsc --noEmit
  ```
  Expected: No errors

- [ ] **V2.2**: Lint passes
  ```bash
  pnpm lint
  ```
  Expected: No errors (warnings acceptable)

- [ ] **V2.3**: Build succeeds
  ```bash
  pnpm build
  ```
  Expected: Build completes successfully

- [ ] **V2.4**: Admin panel loads after restart
  ```bash
  # Restart dev server if needed
  pnpm dev
  ```
  Navigate to: `http://localhost:3000/admin`

- [ ] **V2.5**: Live Preview panel appears
  1. Go to `/admin/collections/articles`
  2. Click on any article (or create one with a slug)
  3. Verify: Split view with preview panel on right

- [ ] **V2.6**: Preview URL is correct
  1. In browser DevTools, inspect the preview iframe
  2. Check `src` attribute
  3. Expected format: `http://localhost:3000/fr/articles/[slug]`

- [ ] **V2.7**: Breakpoint selector is visible
  1. In the preview panel toolbar
  2. Should see Mobile/Tablet/Desktop options

### Commit

- [ ] Stage changes:
  ```bash
  git add src/collections/Articles.ts
  ```

- [ ] Create commit:
  ```bash
  git commit -m "$(cat <<'EOF'
  :sparkles: feat(articles): add Live Preview configuration

  Configure Articles collection with livePreview settings:
  - Bilingual URL generation (FR/EN locales)
  - Responsive breakpoints (mobile/tablet/desktop)
  - Fallback handling for missing slug

  Ref: Story 4.3 - Live Preview (TA2)

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
  EOF
  )"
  ```

### Post-Commit

- [ ] Verify commit: `git log -1 --oneline`
- [ ] Commit 2 COMPLETE

---

## Commit 3: Add NEXT_PUBLIC_SERVER_URL Environment Variable

### Pre-Implementation

- [ ] Commit 2 is complete
- [ ] Live Preview panel is visible in admin

### Implementation Steps

- [ ] **Step 3.1**: Open `.env.example`
  ```
  .env.example
  ```

- [ ] **Step 3.2**: Add Live Preview section at the end of file
  ```bash
  # Live Preview Configuration
  # Base URL for Live Preview iframe (used in Payload Admin)
  NEXT_PUBLIC_SERVER_URL=http://localhost:3000
  ```

- [ ] **Step 3.3**: Open `.env` (local environment)
  ```
  .env
  ```

- [ ] **Step 3.4**: Add the environment variable
  ```bash
  # Live Preview
  NEXT_PUBLIC_SERVER_URL=http://localhost:3000
  ```

- [ ] **Step 3.5**: Save both files

### Verification

- [ ] **V3.1**: `.env.example` has the new variable documented
  ```bash
  grep NEXT_PUBLIC_SERVER_URL .env.example
  ```
  Expected: Shows the variable with comment

- [ ] **V3.2**: `.env` has the value
  ```bash
  grep NEXT_PUBLIC_SERVER_URL .env
  ```
  Expected: `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`

- [ ] **V3.3**: Dev server uses the variable
  1. Restart dev server: `pnpm dev`
  2. Check Live Preview iframe URL
  3. Should use `http://localhost:3000` as base

- [ ] **V3.4**: No secrets exposed
  - Variable only contains domain URL
  - Safe to document in `.env.example`

### Commit

- [ ] Stage changes:
  ```bash
  git add .env.example
  ```

  **Note**: Do NOT commit `.env` (it should be in `.gitignore`)

- [ ] Create commit:
  ```bash
  git commit -m "$(cat <<'EOF'
  :wrench: chore(env): add NEXT_PUBLIC_SERVER_URL for Live Preview

  Add environment variable for Live Preview URL generation:
  - Document in .env.example
  - Required for bilingual preview URL construction

  Ref: Story 4.3 - Live Preview

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
  EOF
  )"
  ```

### Post-Commit

- [ ] Verify commit: `git log -1 --oneline`
- [ ] Commit 3 COMPLETE

---

## Phase Completion

### Final Verification

- [ ] All 3 commits are complete
- [ ] Run full validation: See [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

### Git Status Check

```bash
git log --oneline -3
```

Expected output (most recent first):
```
abc1234 :wrench: chore(env): add NEXT_PUBLIC_SERVER_URL for Live Preview
def5678 :sparkles: feat(articles): add Live Preview configuration
ghi9012 :package: feat(deps): install @payloadcms/live-preview-react
```

### Push to Remote

- [ ] Push commits:
  ```bash
  git push origin feature/story-4.3-phase-1
  ```

### Update Tracking

- [ ] Update EPIC_TRACKING.md:
  - Story 4.3 Progress: `1/3`

---

## Quick Reference

### Commands Summary

| Action | Command |
|--------|---------|
| Install package | `pnpm add @payloadcms/live-preview-react` |
| TypeScript check | `pnpm exec tsc --noEmit` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Dev server | `pnpm dev` |
| Stage files | `git add <files>` |
| Commit | `git commit -m "message"` |

### Gitmoji Reference

| Emoji | Code | Usage |
|-------|------|-------|
| :package: | `:package:` | Dependencies |
| :sparkles: | `:sparkles:` | New feature |
| :wrench: | `:wrench:` | Configuration |

---

**Checklist Created**: 2025-12-11
**Checklist Version**: 1.0
