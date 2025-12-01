# Story 3.1: Routing i18n & Middleware

## Story Overview

**Epic**: Epic 3 - Frontend Core & Design System
**Story**: 3.1
**Status**: PLANNING
**Created**: 2025-12-01

### User Story

> **En tant qu'** Utilisateur, **je veux** que l'URL reflète ma langue (`/fr` ou `/en`) et que ma préférence soit sauvegardée, **afin de** naviguer dans une interface localisée via `next-intl`.

### Business Value

- **Utilisateurs**: Navigation fluide dans leur langue préférée avec URLs partageables
- **SEO**: URLs localisées pour un meilleur référencement multilingue
- **UX**: Persistance de la préférence linguistique entre sessions

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | URLs localisées avec préfixe `/fr` et `/en` | MUST |
| FR-2 | Détection automatique de la langue du navigateur | MUST |
| FR-3 | Persistance de la préférence dans un cookie | MUST |
| FR-4 | Redirection depuis `/` vers la locale appropriée | MUST |
| FR-5 | Support des locales dans les liens internes | MUST |
| FR-6 | Attribut `lang` dynamique sur `<html>` | MUST |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Compatible Cloudflare Workers (middleware léger) | MUST |
| NFR-2 | Performance: middleware < 50ms | SHOULD |
| NFR-3 | Zero CLS lors du changement de langue | MUST |

---

## Acceptance Criteria

### AC-1: URL Routing

```gherkin
Given I am a user visiting the site
When I navigate to /fr/articles
Then the URL shows /fr/articles
And the page content is displayed in French

When I navigate to /en/articles
Then the URL shows /en/articles
And the page content is displayed in English
```

### AC-2: Language Detection

```gherkin
Given I am a new visitor with browser language set to French
When I visit the root URL /
Then I am redirected to /fr
And a NEXT_LOCALE cookie is set to "fr"

Given I am a new visitor with browser language set to English
When I visit the root URL /
Then I am redirected to /en
And a NEXT_LOCALE cookie is set to "en"

Given I am a new visitor with an unsupported browser language
When I visit the root URL /
Then I am redirected to /fr (default locale)
```

### AC-3: Language Persistence

```gherkin
Given I previously visited the site and chose English
When I return to the site
Then my NEXT_LOCALE cookie is read
And I am redirected to /en
And content is displayed in English
```

### AC-4: HTML Lang Attribute

```gherkin
Given I am viewing a page in French
When I inspect the HTML
Then the <html> element has lang="fr"

Given I am viewing a page in English
When I inspect the HTML
Then the <html> element has lang="en"
```

---

## Technical Context

### Current State

**Payload CMS i18n (Already Implemented)**:
- Localization config with FR/EN locales in `payload.config.ts`
- Localized fields in Articles, Categories, Tags, Pages collections
- Database locale tables via migrations
- Admin UI with locale toggle

**Frontend i18n (Missing)**:
- No `next-intl` package installed
- No `middleware.ts` for locale routing
- No `[locale]` dynamic segment in app directory
- No message/translation files
- Static `lang="en"` in root layout

### Target Architecture

```
src/
├── middleware.ts                    # Locale detection & routing
├── i18n/
│   ├── config.ts                    # i18n configuration
│   ├── request.ts                   # Server-side i18n
│   └── routing.ts                   # Routing configuration
├── messages/
│   ├── fr.json                      # French translations
│   └── en.json                      # English translations
└── app/
    ├── [locale]/
    │   ├── (frontend)/
    │   │   ├── layout.tsx           # Locale-aware layout
    │   │   └── page.tsx             # HomePage
    │   └── layout.tsx               # Root locale layout
    └── (payload)/                   # Unchanged (admin routes)
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next-intl | ^4.x | i18n routing, messages, formatters |

### Constraints

1. **Cloudflare Workers**: Middleware must be lightweight and edge-compatible
2. **Payload Admin**: Admin routes (`/admin/*`) must NOT be affected by locale routing
3. **API Routes**: API routes (`/api/*`) must NOT be prefixed with locale
4. **Static Generation**: Prefer static paths where possible for performance

---

## Dependencies

### Internal Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Epic 1 (Foundation) | Epic | COMPLETED |
| Payload i18n config | Config | COMPLETED |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| next-intl | Package | To install |
| next-intl docs | Reference | Available |

### Blocked By

None - This story can start immediately.

### Blocks

| Story | Reason |
|-------|--------|
| Story 3.3 | Layout needs i18n context for language switcher |

---

## Out of Scope

- UI translation messages (minimal set only for structure validation)
- Language switcher component (Story 3.3)
- Content translation from Payload (Story 4.x)
- SEO hreflang tags (Story 6.1)

---

## Testing Strategy

### Unit Tests

- i18n configuration validation
- Locale detection logic
- Cookie handling utilities

### Integration Tests

- Middleware routing behavior
- Layout locale context injection
- Navigation with locale preservation

### E2E Tests

- Full navigation flow with locale switching
- Cookie persistence across sessions
- Redirect behavior from root URL

---

## Reference Documents

- [PRD.md](../../../../PRD.md) - EF3 (Internationalisation Native)
- [next-intl Documentation](https://next-intl.dev)
- [Payload i18n Config](../../../../payload.config.ts)
- [EPIC_TRACKING.md](../EPIC_TRACKING.md)
