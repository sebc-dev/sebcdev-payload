# Story 2.1: Configuration des Collections Blog & i18n

## Story Overview

| Attribute    | Value                                         |
| ------------ | --------------------------------------------- |
| **Epic**     | Epic 2 - Content Management System (CMS) Core |
| **Story ID** | 2.1                                           |
| **Title**    | Configuration des Collections Blog & i18n     |
| **Status**   | PLANNING                                      |
| **Created**  | 2025-11-29                                    |

## User Story

**En tant qu'** Auteur,
**Je veux** creer les collections `Articles` et `Pages` avec l'option `localized: true` sur les champs de contenu (Titre, Corps, SEO),
**Afin de** gerer mon contenu en Francais et Anglais.

## Context

Cette story etablit les fondations du systeme de gestion de contenu bilingue. Elle configure les collections principales (Articles, Pages, Categories, Tags) avec le support i18n natif de Payload CMS, permettant a l'auteur de creer et gerer du contenu dans les deux langues cibles (FR/EN).

### Current State

- Payload CMS 3.0 deploye sur Cloudflare Workers
- Collections existantes: `Users`, `Media`
- Base de donnees D1 (SQLite) operationnelle
- Pas de configuration i18n
- Pas de collections de contenu (Articles, Pages)

### Target State

- Configuration i18n activee (FR par defaut, EN secondaire)
- Collection `Articles` avec champs localises
- Collection `Pages` avec champs localises
- Collection `Categories` avec 9 categories canoniques
- Collection `Tags` pour la taxonomie libre
- Relations entre collections configurees
- Types TypeScript generes et synchronises

## Requirements from PRD

### Functional Requirements

**EF1 - Gestion de Contenu (Auteur Unique)**

- CA1: L'acces administrateur permet de creer/editer/supprimer des Articles, Pages, Categories et Tags
- CA3: Un script de "seed" initialise la base de donnees avec les 9 categories canoniques

**EF2 - Experience d'Edition Riche & Structuree**

- CA2: Le systeme genere automatiquement une Table des Matieres (TOC) basee sur la hierarchie des titres
- CA3: Le systeme calcule et persiste le "Temps de lecture estime" lors de la sauvegarde

**EF3 - Internationalisation Native (i18n)**

- CA1: Les champs de contenu (Titre, Corps, SEO) sont localises dans Payload (champs `localized: true`)
- CA3: Mecanisme de Fallback: si une traduction est manquante, le contenu s'affiche dans la langue par defaut

**EF7 - Identite Visuelle Dynamique**

- CA1: La collection "Categories" inclut des champs de configuration visuelle (Selecteur de couleur HEX, Icone)

### Non-Functional Requirements

**ENF3 - Integrite des Donnees**

- CA1: Stockage sur Cloudflare D1
- CA2: Acces via Drizzle ORM uniquement
- CA3: Le schema Payload est la "Single Source of Truth"

## Acceptance Criteria

### AC1: Configuration i18n

- [ ] Payload configure avec `localization.locales: ['fr', 'en']`
- [ ] `fr` defini comme locale par defaut (`defaultLocale: 'fr'`)
- [ ] Fallback automatique vers la locale par defaut configure

### AC2: Collection Articles

- [ ] Champs localises: `title`, `content`, `excerpt`, `metaTitle`, `metaDescription`
- [ ] Champs non-localises: `slug`, `publishedAt`, `status`, `author`, `featuredImage`
- [ ] Relation vers `Categories` (many-to-one)
- [ ] Relation vers `Tags` (many-to-many)
- [ ] Relation vers `Media` pour l'image principale
- [ ] Hook `beforeChange` pour calculer `readingTime`
- [ ] Champ `status` avec options: draft, published, archived

### AC3: Collection Pages

- [ ] Champs localises: `title`, `content`, `metaTitle`, `metaDescription`
- [ ] Champs non-localises: `slug`, `status`, `template`
- [ ] Champ `template` pour identifier le type de page (home, about, contact, etc.)

### AC4: Collection Categories

- [ ] Champs localises: `name`, `description`
- [ ] Champs non-localises: `slug`, `color` (hex), `icon`
- [ ] Contrainte d'unicite sur `slug`
- [ ] 9 categories canoniques predefinies (via seed)

### AC5: Collection Tags

- [ ] Champs localises: `name`
- [ ] Champs non-localises: `slug`
- [ ] Contrainte d'unicite sur `slug`

### AC6: Types TypeScript

- [ ] `pnpm generate:types:payload` execute sans erreur
- [ ] Types generes incluent toutes les nouvelles collections
- [ ] Types incluent les champs localises avec la structure appropriee

### AC7: Migrations

- [ ] Migration generee avec `pnpm payload migrate:create`
- [ ] Migration applicable sans erreur
- [ ] Schema D1 synchronise avec les collections Payload

## Technical Specifications

### i18n Configuration

```typescript
// payload.config.ts
localization: {
  locales: [
    { label: 'Francais', code: 'fr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'fr',
  fallback: true,
}
```

### Collection Schema Overview

```
Articles
├── title (localized, required)
├── slug (unique, auto-generated)
├── content (localized, richText/Lexical)
├── excerpt (localized)
├── featuredImage (relation -> Media)
├── category (relation -> Categories)
├── tags (relation -> Tags, hasMany)
├── author (relation -> Users)
├── publishedAt (date)
├── status (select: draft/published/archived)
├── readingTime (number, computed)
└── SEO Group (localized)
    ├── metaTitle
    └── metaDescription

Pages
├── title (localized, required)
├── slug (unique)
├── content (localized, richText/Lexical)
├── template (select)
├── status (select: draft/published)
└── SEO Group (localized)
    ├── metaTitle
    └── metaDescription

Categories
├── name (localized, required)
├── slug (unique, required)
├── description (localized)
├── color (text, hex format)
└── icon (text, icon name)

Tags
├── name (localized, required)
└── slug (unique, required)
```

### Categories Canoniques (9)

Definies dans le PRD - Strategie de contenu:

1. Actualites (News)
2. Tutoriel (Tutorial)
3. Retrospective (Retrospective)
4. Guide (Guide)
5. Analyse (Analysis)
6. Opinion (Opinion)
7. Ressources (Resources)
8. Projet (Project)
9. Veille (Watch)

### Files to Create/Modify

| File                                | Action     | Description                               |
| ----------------------------------- | ---------- | ----------------------------------------- |
| `src/payload.config.ts`             | Modify     | Add i18n config, register new collections |
| `src/collections/Articles.ts`       | Create     | Article collection definition             |
| `src/collections/Pages.ts`          | Create     | Page collection definition                |
| `src/collections/Categories.ts`     | Create     | Category collection definition            |
| `src/collections/Tags.ts`           | Create     | Tag collection definition                 |
| `src/collections/index.ts`          | Create     | Collection exports barrel                 |
| `src/hooks/calculateReadingTime.ts` | Create     | Reading time calculation hook             |
| `src/migrations/*.ts`               | Generate   | Database migration                        |
| `src/payload-types.ts`              | Regenerate | TypeScript types                          |

## Dependencies

### Prerequisites

- Epic 1 completed (Foundation & Cloudflare Architecture)
- Payload CMS operational
- D1 database accessible

### Blocks

- Story 2.2 (R2 validation) - can start in parallel
- Story 2.3 (Lexical & Seed) - depends on collections being created

## Risks & Mitigations

| Risk                          | Impact | Probability | Mitigation                                            |
| ----------------------------- | ------ | ----------- | ----------------------------------------------------- |
| Migration issues with D1      | High   | Medium      | Test migrations locally first, backup before applying |
| Lexical editor i18n conflicts | Medium | Low         | Follow Payload docs for localized richText            |
| Type generation failures      | Medium | Low         | Run type generation after each collection change      |

## Testing Strategy

### Unit Tests

- Hook `calculateReadingTime` with various content lengths

### Integration Tests

- CRUD operations on each collection
- i18n field storage and retrieval
- Relation integrity between collections

### Manual Testing

- Admin panel navigation
- Create article in FR, switch to EN
- Verify fallback behavior

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Collections visible in Payload admin
- [ ] i18n toggle functional in admin UI
- [ ] Migration successfully applied
- [ ] Types generated and synchronized
- [ ] Integration tests passing
- [ ] No TypeScript errors
- [ ] Code reviewed

## References

- [Payload CMS i18n Documentation](https://payloadcms.com/docs/configuration/i18n)
- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload Fields Documentation](https://payloadcms.com/docs/fields/overview)
- [PRD.md - EF1, EF2, EF3, EF7](../../PRD.md)
