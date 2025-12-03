# Commit Checklist: Phase 3 - Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 3 of 5
**Total Commits**: 4

---

## How to Use This Document

For each commit:
1. Read the **Pre-Commit** section before starting
2. Follow the **Implementation** steps
3. Complete the **Validation** checklist
4. Create the commit with the provided message
5. Move to the next commit

---

## Commit 1: Add Footer i18n Keys

### Pre-Commit Checklist

- [ ] On correct branch (`epic-3-story-3.3-planning` or feature branch)
- [ ] Working directory clean (`git status`)
- [ ] Phase 2 complete (Header integrated in layout)

### Implementation Steps

#### Step 1.1: Update French Translations

Open `messages/fr.json` and add the `footer` section after `navigation`:

```json
{
  "navigation": {
    // ... existing navigation keys
  },
  "footer": {
    "tagline": "Blog technique sur l'IA, l'UX et l'ingénierie logicielle",
    "copyright": "© {year} sebc.dev. Tous droits réservés.",
    "links": {
      "articles": "Articles",
      "contact": "Contact"
    }
  },
  "metadata": {
    // ... existing metadata keys
  }
}
```

#### Step 1.2: Update English Translations

Open `messages/en.json` and add the `footer` section:

```json
{
  "navigation": {
    // ... existing navigation keys
  },
  "footer": {
    "tagline": "Technical blog about AI, UX, and software engineering",
    "copyright": "© {year} sebc.dev. All rights reserved.",
    "links": {
      "articles": "Articles",
      "contact": "Contact"
    }
  },
  "metadata": {
    // ... existing metadata keys
  }
}
```

### Validation Checklist

- [ ] JSON syntax valid (`pnpm build` succeeds)
- [ ] `footer.tagline` key exists in both files
- [ ] `footer.copyright` key exists in both files with `{year}` placeholder
- [ ] `footer.links.articles` key exists in both files
- [ ] `footer.links.contact` key exists in both files
- [ ] French translations are correct French
- [ ] English translations are correct English

### Commit

```bash
git add messages/fr.json messages/en.json
git commit -m "$(cat <<'EOF'
🌐 i18n(footer): add translation keys for footer content

Add footer namespace with translations for:
- Site tagline
- Copyright notice with year placeholder
- Secondary navigation links (Articles, Contact)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
pnpm build  # Should succeed
```

---

## Commit 2: Create Footer Component

### Pre-Commit Checklist

- [ ] Commit 1 complete (i18n keys added)
- [ ] Build passing

### Implementation Steps

#### Step 2.1: Create Footer Component File

Create `src/components/layout/Footer.tsx`:

```tsx
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

/**
 * Footer Component
 *
 * Site footer displaying:
 * - Brand name and tagline
 * - Secondary navigation links
 * - Copyright with dynamic year
 *
 * This is a Server Component - no client-side JS required.
 * Responsive design: centered on mobile, spread on desktop.
 *
 * @returns Footer element with semantic contentinfo role
 */
export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="mb-6 lg:mb-0">
            <p className="text-lg font-bold text-foreground">sebc.dev</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          {/* Navigation Links */}
          <nav className="mb-6 flex gap-6 lg:mb-0">
            <Link
              href="/articles"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.articles')}
            </Link>
            <a
              href="mailto:contact@sebc.dev"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.contact')}
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### Code Explanation

| Section | Purpose |
|---------|---------|
| `useTranslations('footer')` | Access footer translation namespace |
| `new Date().getFullYear()` | Get current year for copyright |
| `border-t border-border bg-card` | Top border, card background |
| `flex flex-col lg:flex-row` | Stack on mobile, row on desktop |
| `items-center text-center` | Center content on mobile |
| `lg:items-start lg:justify-between lg:text-left` | Spread on desktop |
| `Link href="/articles"` | Locale-aware link component |
| `<a href="mailto:...">` | Standard anchor for email |
| `t('copyright', { year: currentYear })` | Interpolate year into template |

### Validation Checklist

- [ ] File created at correct path
- [ ] No TypeScript errors
- [ ] Uses `useTranslations` from `next-intl`
- [ ] Uses `Link` from `@/i18n/routing`
- [ ] `footer` element used (semantic HTML)
- [ ] Responsive classes applied correctly
- [ ] Dynamic year implemented
- [ ] `pnpm lint` passes

### Commit

```bash
git add src/components/layout/Footer.tsx
git commit -m "$(cat <<'EOF'
✨ feat(layout): create Footer component with branding and navigation

Add Footer component featuring:
- Brand section with site name and translated tagline
- Secondary navigation (Articles, Contact email)
- Dynamic copyright year with i18n support
- Responsive layout (centered mobile, spread desktop)
- Semantic HTML with proper footer element

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
pnpm lint   # Should pass
pnpm build  # Should succeed
```

---

## Commit 3: Export Footer from Barrel

### Pre-Commit Checklist

- [ ] Commit 2 complete (Footer.tsx created)
- [ ] Build passing

### Implementation Steps

#### Step 3.1: Update Barrel Export

Edit `src/components/layout/index.ts`:

**Before**:
```typescript
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

**After**:
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

Note: Keep exports in alphabetical order for consistency.

### Validation Checklist

- [ ] Footer export added
- [ ] Exports in alphabetical order
- [ ] No duplicate exports
- [ ] `pnpm build` succeeds
- [ ] Can import: `import { Footer } from '@/components/layout'`

### Commit

```bash
git add src/components/layout/index.ts
git commit -m "$(cat <<'EOF'
📦 refactor(layout): export Footer from barrel file

Add Footer to layout component exports for consistent import pattern:
import { Header, Footer } from '@/components/layout'

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Integrate Footer into Frontend Layout

### Pre-Commit Checklist

- [ ] Commit 3 complete (Footer exported)
- [ ] Build passing

### Implementation Steps

#### Step 4.1: Update Frontend Layout

Edit `src/app/[locale]/(frontend)/layout.tsx`:

**Before**:
```tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout'

export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
```

**After**:
```tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Footer, Header } from '@/components/layout'

export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

### Key Changes Explained

| Change | Reason |
|--------|--------|
| Add `Footer` to import | Access Footer component |
| Wrap in `<div className="flex min-h-screen flex-col">` | Sticky footer pattern container |
| Change `<main>` from `min-h-screen` to `flex-1` | Let main grow to push footer down |
| Add `<Footer />` after main | Render footer at bottom |

### Sticky Footer Pattern

This CSS pattern ensures the footer stays at the bottom:

```
Container (min-h-screen, flex, flex-col)
├── Header (natural height)
├── Main (flex-1 = grows to fill remaining space)
└── Footer (natural height, pushed to bottom)
```

### Validation Checklist

- [ ] Import statement updated (Footer added)
- [ ] Wrapper div with sticky footer classes
- [ ] Main uses `flex-1` instead of `min-h-screen`
- [ ] Footer rendered after main
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

### Commit

```bash
git add src/app/[locale]/(frontend)/layout.tsx
git commit -m "$(cat <<'EOF'
🎨 feat(layout): integrate Footer into frontend layout

Add Footer component to frontend layout with sticky footer pattern:
- Wrap Header + Main + Footer in flex column container
- Use flex-1 on main to push footer to bottom
- Footer now visible on all frontend pages

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
# Build should succeed
pnpm build

# Start dev server and verify
pnpm dev

# Check in browser:
# - http://localhost:3000/fr - Footer visible, French text
# - http://localhost:3000/en - Footer visible, English text
# - Footer stays at bottom with short content
# - Links work correctly
```

---

## Final Phase Checklist

After all 4 commits:

### Build Verification

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors

### Functional Verification

- [ ] Footer visible on `/fr` homepage
- [ ] Footer visible on `/en` homepage
- [ ] Footer displays French text on `/fr`
- [ ] Footer displays English text on `/en`
- [ ] "sebc.dev" text displayed
- [ ] Tagline translated correctly
- [ ] "Articles" link works
- [ ] "Contact" link opens email client
- [ ] Copyright shows current year (2025)

### Visual Verification

- [ ] Footer has top border
- [ ] Footer background is card color
- [ ] Links have hover states
- [ ] Mobile: content centered and stacked
- [ ] Desktop: content spread horizontally

### Accessibility Verification

- [ ] `<footer>` element used (contentinfo landmark)
- [ ] Links have accessible text
- [ ] Color contrast acceptable

---

## Troubleshooting

### JSON Parse Error

**Symptom**: Build fails with JSON syntax error

**Fix**: Validate JSON structure, check for missing commas or brackets
```bash
# Test JSON validity
node -e "require('./messages/fr.json')"
node -e "require('./messages/en.json')"
```

### Footer Not Visible

**Symptom**: Footer doesn't appear on page

**Fix**:
1. Check import in layout.tsx
2. Verify Footer is exported from barrel
3. Check for CSS issues (display: none, etc.)

### Footer Not at Bottom

**Symptom**: Footer floats in middle of page

**Fix**:
1. Verify wrapper has `min-h-screen`
2. Verify main has `flex-1`
3. Check container has `flex flex-col`

### Translation Not Working

**Symptom**: Shows key instead of translation

**Fix**:
1. Verify key exists in both message files
2. Check namespace matches (`footer` vs `Footer`)
3. Ensure `useTranslations('footer')` is correct

---

## Summary

| Commit | Files Changed | Purpose |
|--------|---------------|---------|
| 1 | `messages/{fr,en}.json` | Add i18n keys |
| 2 | `Footer.tsx` | Create component |
| 3 | `index.ts` | Export from barrel |
| 4 | `layout.tsx` | Integrate into layout |

**Total**: 4 commits, 1 new file, 4 modified files

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
