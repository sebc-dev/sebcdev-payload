# Phase 1: i18n Configuration - Implementation Plan

## Atomic Commit Strategy

This phase is implemented through **2 atomic commits**, each delivering a specific, testable piece of functionality.

---

## Commit Overview

| #   | Type  | Message                                                           | Files | Lines | Time   |
| --- | ----- | ----------------------------------------------------------------- | ----- | ----- | ------ |
| 1   | feat  | `feat(i18n): add localization configuration to payload.config.ts` | 1     | +15   | 30 min |
| 2   | chore | `chore(types): regenerate payload types with i18n support`        | 1     | ~50   | 15 min |

**Total**: 2 commits, ~65 lines, 45 minutes

---

## Commit 1: Add Localization Configuration

### Commit Message

```
feat(i18n): add localization configuration to payload.config.ts

- Configure FR as default locale with EN as secondary
- Enable fallback to default locale for missing translations
- Add human-readable labels for admin UI language selector

Part of Story 2.1 - Phase 1
```

### Objective

Add the `localization` configuration block to enable i18n support in Payload CMS.

### Files Changed

| File                    | Action | Changes                |
| ----------------------- | ------ | ---------------------- |
| `src/payload.config.ts` | Modify | Add localization block |

### Implementation Details

#### Before

```typescript
// src/payload.config.ts
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})
```

#### After

```typescript
// src/payload.config.ts
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // i18n Configuration - Story 2.1 Phase 1
  localization: {
    locales: [
      { label: 'Francais', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})
```

### Configuration Explanation

| Property          | Value                   | Purpose                                            |
| ----------------- | ----------------------- | -------------------------------------------------- |
| `locales`         | Array of locale objects | Defines available languages                        |
| `locales[].label` | Human-readable name     | Displayed in admin UI selector                     |
| `locales[].code`  | ISO code (fr, en)       | Used in API and database                           |
| `defaultLocale`   | `'fr'`                  | Default language for content                       |
| `fallback`        | `true`                  | Show default locale content if translation missing |

### Verification Steps

1. **Syntax Check**: Ensure no TypeScript errors

   ```bash
   pnpm tsc --noEmit
   ```

2. **Dev Server**: Start and verify no runtime errors

   ```bash
   pnpm dev
   ```

3. **Admin UI**: Navigate to `/admin` and verify language toggle appears

### Success Criteria

- [ ] No TypeScript compilation errors
- [ ] Development server starts without errors
- [ ] Admin UI loads successfully
- [ ] Language toggle visible in admin header

### Estimated Time

- Implementation: 15 minutes
- Verification: 15 minutes
- **Total**: 30 minutes

---

## Commit 2: Regenerate TypeScript Types

### Commit Message

```
chore(types): regenerate payload types with i18n support

- Update payload-types.ts with locale configuration
- Add Config.locale type for type-safe locale handling

Part of Story 2.1 - Phase 1
```

### Objective

Regenerate Payload types to include locale support, enabling type-safe i18n throughout the codebase.

### Files Changed

| File                   | Action     | Changes                  |
| ---------------------- | ---------- | ------------------------ |
| `src/payload-types.ts` | Regenerate | Updated Config interface |

### Implementation Details

#### Command

```bash
pnpm generate:types:payload
```

#### Expected Changes in payload-types.ts

The `Config` interface will be updated to include locale information:

```typescript
// Before
export interface Config {
  // ...
  locale: null
  // ...
}

// After
export interface Config {
  // ...
  locale: 'fr' | 'en'
  // ...
}
```

### Verification Steps

1. **Type Generation**: Run type generation

   ```bash
   pnpm generate:types:payload
   ```

2. **Verify Output**: Check that locale type is present

   ```bash
   grep -A 2 "locale:" src/payload-types.ts
   ```

3. **Build Check**: Ensure build succeeds
   ```bash
   pnpm build
   ```

### Success Criteria

- [ ] `pnpm generate:types:payload` completes without errors
- [ ] `payload-types.ts` contains `locale: 'fr' | 'en'`
- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors in codebase

### Estimated Time

- Type Generation: 5 minutes
- Verification: 10 minutes
- **Total**: 15 minutes

---

## Implementation Order

```
┌─────────────────────────────────────┐
│  Commit 1: Localization Config      │
│  - Modify payload.config.ts         │
│  - Verify admin UI toggle           │
└─────────────────┬───────────────────┘
                  │
                  v
┌─────────────────────────────────────┐
│  Commit 2: Regenerate Types         │
│  - Run pnpm generate:types:payload  │
│  - Verify locale type in Config     │
└─────────────────────────────────────┘
```

---

## Rollback Strategy

### Commit 1 Rollback

If issues occur after Commit 1:

```bash
# Revert the localization config
git revert HEAD

# Or manually remove the localization block from payload.config.ts
```

### Commit 2 Rollback

If issues occur after Commit 2:

```bash
# Revert type regeneration
git revert HEAD

# Regenerate types without i18n (requires reverting Commit 1 first)
pnpm generate:types:payload
```

---

## Testing During Implementation

### After Commit 1

| Test            | Command             | Expected Result          |
| --------------- | ------------------- | ------------------------ |
| TypeScript      | `pnpm tsc --noEmit` | No errors                |
| Dev Server      | `pnpm dev`          | Server starts            |
| Admin Access    | Browser: `/admin`   | Login page loads         |
| Language Toggle | Admin UI            | Toggle visible in header |

### After Commit 2

| Test            | Command                       | Expected Result |
| --------------- | ----------------------------- | --------------- |
| Type Generation | `pnpm generate:types:payload` | Success         |
| Build           | `pnpm build`                  | Success         |
| Lint            | `pnpm lint`                   | No errors       |
| Full Test       | `pnpm test`                   | All tests pass  |

---

## Common Issues & Solutions

### Issue 1: Type Generation Fails

**Symptom**: `pnpm generate:types:payload` fails with error

**Solution**:

```bash
# Clear cache and retry
rm -rf .next
pnpm generate:types:payload
```

### Issue 2: Admin UI Not Showing Toggle

**Symptom**: Language toggle not visible in admin header

**Solution**:

1. Verify `localization` block is correctly placed in config
2. Check browser console for errors
3. Hard refresh the page (Ctrl+Shift+R)

### Issue 3: Dev Server Crashes

**Symptom**: Server crashes on startup after adding localization

**Solution**:

1. Check for syntax errors in `payload.config.ts`
2. Verify all required properties are present
3. Check Payload version compatibility

---

## Code Quality Checklist

### Before Each Commit

- [ ] Code follows project style guide
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] TypeScript strict mode passes

### Commit Message Format

Follow Gitmoji convention:

```
<type>(<scope>): <description>

<body>

<footer>
```

Types used in this phase:

- `feat`: New feature (localization config)
- `chore`: Maintenance task (type regeneration)

---

## References

- [Payload i18n Configuration](https://payloadcms.com/docs/configuration/i18n)
- [Payload TypeScript Generation](https://payloadcms.com/docs/typescript/generating-types)
- [Project CLAUDE.md](../../../../../../CLAUDE.md) - Commit conventions

---

## Next Steps

After completing both commits:

1. **Verify all success criteria** in [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. **Update EPIC_TRACKING.md** with Phase 1 completion
3. **Proceed to Phase 2**: Categories & Tags Collections

---

**Implementation Status**: READY TO START
