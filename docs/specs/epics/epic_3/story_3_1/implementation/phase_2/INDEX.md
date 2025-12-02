# Phase 2 - Middleware & Routing

**Story**: Epic 3 Story 3.1 - Routing i18n & Middleware
**Phase**: 2 of 4
**Status**: IN PROGRESS
**Started**: 2025-12-02
**Completed**: -

---

## Overview

Cette phase implémente le middleware Next.js pour la détection automatique des locales et le routing intelligent. Elle établit le pont entre la configuration i18n (Phase 1) et la restructuration de l'app directory (Phase 3).

### Objectives

1. Créer `middleware.ts` pour détecter et router les locales
2. Implémenter la persistance via cookie `NEXT_LOCALE`
3. Exclure les routes `/admin` et `/api` du routing i18n
4. Configurer le matcher pour les routes frontend uniquement

### Success Criteria

- [ ] Visiting `/` redirects to `/fr` or `/en` based on browser preference
- [ ] Cookie `NEXT_LOCALE` is set on first visit
- [ ] Returning visitors use cookie preference (respects saved locale)
- [ ] `/admin/*` routes are NOT affected by middleware
- [ ] `/api/*` routes are NOT affected by middleware
- [ ] Middleware executes in < 50ms (Cloudflare Workers requirement)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors

---

## Deliverables

| Deliverable | Files | Description |
|-------------|-------|-------------|
| Middleware implementation | `middleware.ts` | Main middleware at project root |
| Routing configuration | `src/i18n/routing.ts` | Update with matcher config |
| Next.js configuration | `next.config.ts` | Add i18n-related config |

---

## Commits Overview

| # | Title | Scope | Duration |
|---|-------|-------|----------|
| 1 | Create middleware.ts with locale detection | Middleware core logic | 30-45 min |
| 2 | Configure middleware matcher and cookie handling | Route exclusion & persistence | 20-30 min |
| 3 | Update next.config.ts for i18n plugin | Config integration | 15-20 min |

**Total**: 3 commits, ~1.5 hours

---

## Technical Notes

### Middleware Patterns

The middleware will:
1. Extract Accept-Language header
2. Check for existing NEXT_LOCALE cookie
3. Determine preferred locale (cookie > Accept-Language > default)
4. Set NEXT_LOCALE cookie for persistence
5. Redirect root (`/`) to locale-specific path (e.g., `/fr`)

### Cloudflare Workers Considerations

- Middleware must use Web APIs only (no Node.js APIs)
- Keep bundle size minimal (target < 5KB)
- Execution should be < 50ms
- No external dependencies in middleware code

### Matcher Configuration

```typescript
// Only match frontend routes
export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /admin (Payload admin)
    // - /_next (Next.js internals)
    // - /.*\\..* (files with extensions)
    '/((?!api|admin|_next|.*\\..*).*)',
  ],
}
```

---

## Dependencies

- Phase 1: i18n configuration files (REQUIRED)
- External: next-intl package (installed in Phase 1)

---

## File Structure

After Phase 2:

```
project-root/
├── middleware.ts (new)
├── next.config.ts (modified)
├── src/
│   └── i18n/
│       ├── config.ts (unchanged)
│       ├── routing.ts (modified - add matcher)
│       └── request.ts (unchanged)
└── messages/
    ├── fr.json (unchanged)
    └── en.json (unchanged)
```

---

## Risk Assessment

### Medium Risk Factors

1. **Middleware compatibility**: Must work correctly with Cloudflare Workers
2. **Cookie handling**: Must persist correctly across browsers
3. **Redirect loops**: Incorrect matcher could cause infinite redirects
4. **Admin accessibility**: Must not interfere with `/admin` routes

### Mitigation Strategies

- Test middleware locally with `pnpm dev` first
- Verify Cloudflare preview deployment works
- Use explicit route exclusion in matcher
- Test `/admin` accessibility after each change

---

## Related Documentation

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Full story plan
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Detailed implementation guide
- [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) - Per-commit checklist

---

## Next Steps

1. Review this document
2. Read IMPLEMENTATION_PLAN.md for detailed technical approach
3. Follow COMMIT_CHECKLIST.md for each commit
4. Run validation commands after each commit
5. Update this status as progress is made
