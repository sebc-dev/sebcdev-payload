# Phase 2 - Environment Setup

This guide covers all environment setup needed for Phase 2.

---

## 📋 Prerequisites

### Previous Phases

- [x] Phase 1 completed and validated
  - Article page route exists at `/[locale]/articles/[slug]`
  - ArticleHeader and ArticleFooter components working
  - Payload fetch utilities (`getArticleBySlug`) functional
  - Translation keys in place

### Tools Required

- [x] Node.js 18.20.2+ or 20.9.0+
- [x] pnpm 9.x or 10.x
- [x] TypeScript 5.7.3
- [x] Git

### Services Required

- [x] Payload CMS with Lexical editor configured
- [x] D1 database with articles collection
- [x] Development server accessible

---

## 📦 Dependencies

### Existing Dependencies (Already Installed)

Phase 2 uses existing dependencies - **no new packages required**:

```json
{
  "@payloadcms/richtext-lexical": "3.63.0",
  "react": "19.1.2",
  "next": "15.4.8",
  "tailwindcss": "^4.1.17"
}
```

### Verify Installation

```bash
# Check that Lexical richtext is installed
pnpm list @payloadcms/richtext-lexical

# Should output:
# @payloadcms/richtext-lexical 3.63.0
```

### Optional: Tailwind Typography Plugin

Check if `@tailwindcss/typography` is needed for prose styling:

```bash
# Check if typography plugin is installed
pnpm list @tailwindcss/typography

# If not installed and needed, add it:
# pnpm add -D @tailwindcss/typography
```

**Note**: With Tailwind CSS 4, prose styles can be applied manually via CSS classes. The typography plugin is optional.

---

## 🔧 Environment Variables

### Required Variables

Phase 2 uses the same environment variables as Phase 1:

```env
# Required for Payload CMS
PAYLOAD_SECRET=your-secret-key

# Database (D1 via Wrangler)
# Configured automatically via wrangler.jsonc
```

### No New Variables Needed

Phase 2 does not require any additional environment variables.

---

## 🗄️ Test Data Setup

### Requirement: Article with Rich Content

To test the serializer, you need at least one article with rich content in the database.

### Option 1: Use Seed Script

```bash
# Run the seed script to populate test data
pnpm seed
```

### Option 2: Manual Creation via Admin

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Access Payload admin:
   ```
   http://localhost:3000/admin
   ```

3. Create an article with rich content including:
   - Headings (h2, h3)
   - Paragraphs with formatted text (bold, italic)
   - Bullet list
   - Numbered list
   - Blockquote
   - Links (internal and external)

### Sample Rich Content to Add

Create an article with this content to test all node types:

```
# Introduction

This is a **bold** and *italic* paragraph with `inline code`.

## Getting Started

Here's what you need to know:

- First item
- Second item with **bold text**
- Third item

### Step by Step

1. Install dependencies
2. Configure settings
3. Run the application

> This is a blockquote with important information that spans multiple lines.

For more details, visit [our documentation](https://example.com) or check the [internal guide](/fr/articles/guide).

Contact us at [email@example.com](mailto:email@example.com) or call [+1234567890](tel:+1234567890).
```

---

## 📁 Directory Structure

### Files to Create

```
src/components/richtext/
├── index.ts              # Barrel exports
├── types.ts              # TypeScript interfaces
├── serialize.tsx         # Main serializer
├── RichText.tsx          # Main component
└── nodes/
    ├── index.ts          # Node components barrel
    ├── Paragraph.tsx     # Paragraph component
    ├── Heading.tsx       # Heading component
    ├── List.tsx          # List/ListItem components
    ├── Quote.tsx         # Blockquote component
    └── Link.tsx          # Link component

tests/unit/components/richtext/
├── serialize.spec.ts     # Serializer tests
├── Paragraph.spec.ts     # Paragraph tests
├── Heading.spec.ts       # Heading tests
├── List.spec.ts          # List tests
├── Quote.spec.ts         # Quote tests
└── Link.spec.ts          # Link tests
```

### Create Directories

```bash
# Create component directories
mkdir -p src/components/richtext/nodes

# Create test directories
mkdir -p tests/unit/components/richtext
```

---

## ✅ Connection Tests

### Test Payload Connection

```bash
# Start dev server
pnpm dev

# In another terminal, check that articles load
curl http://localhost:3000/fr/articles/[your-test-slug]
```

**Expected Result**: Page loads with article header and JSON placeholder

### Test TypeScript

```bash
# Verify TypeScript compiles
pnpm exec tsc --noEmit
```

**Expected Result**: No errors

### Test Vitest

```bash
# Run unit tests
pnpm test:unit
```

**Expected Result**: All existing tests pass

---

## 🚨 Troubleshooting

### Issue: Article content is null

**Symptoms**:
- `payloadArticle.content` is null or undefined
- RichText renders nothing

**Solutions**:

1. Check that the article has content in Payload admin
2. Verify the content field is using Lexical editor
3. Check locale is correct in fetch query

**Verify Fix**:
```bash
# Check article in admin
open http://localhost:3000/admin/collections/articles
```

---

### Issue: TypeScript errors with Lexical types

**Symptoms**:
- Type errors when accessing node properties
- `Property 'children' does not exist on type`

**Solutions**:

1. Ensure type guards are used correctly
2. Use type assertions where needed
3. Check that types match Payload Lexical output

**Verify Fix**:
```bash
pnpm exec tsc --noEmit
```

---

### Issue: Prose styles not applying

**Symptoms**:
- Text renders but without proper styling
- Headings same size as paragraphs

**Solutions**:

1. Verify `prose` class is on container
2. Check `prose-invert` for dark mode
3. Ensure Tailwind is processing the file

**Verify Fix**:
```bash
# Rebuild Tailwind
pnpm dev
# Check browser DevTools for prose classes
```

---

### Issue: Links not working

**Symptoms**:
- Internal links cause full page reload
- External links don't open in new tab

**Solutions**:

1. Verify Next.js Link is used for internal
2. Check `isExternalUrl` function logic
3. Ensure `target="_blank"` on external links

**Verify Fix**:
```bash
# Test link behavior in browser
# Internal: should be instant navigation
# External: should open new tab
```

---

## 📝 Setup Checklist

Complete this checklist before starting implementation:

- [ ] Phase 1 completed and working
- [ ] Dev server starts without errors (`pnpm dev`)
- [ ] At least one test article exists with rich content
- [ ] TypeScript compiles (`pnpm exec tsc --noEmit`)
- [ ] Unit tests pass (`pnpm test:unit`)
- [ ] Directories created for new components
- [ ] Familiar with Lexical JSON structure (see IMPLEMENTATION_PLAN.md)

**Environment is ready! 🚀**

---

## 📚 Reference Materials

### Lexical JSON Structure

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) section "Lexical JSON Structure Reference" for detailed JSON examples.

### Payload Lexical Documentation

- [Payload Rich Text Lexical](https://payloadcms.com/docs/rich-text/lexical)
- [Lexical Editor Docs](https://lexical.dev/docs/intro)

### Tailwind Prose

- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [Prose Class Reference](https://tailwindcss.com/docs/plugins#typography)

---

**Setup Guide Created**: 2025-12-09
**Last Updated**: 2025-12-09
