# Story 1.2 - Récupération & Configuration Locale

**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Story ID**: 1.2
**Created**: 2025-11-28
**Status**: 📋 PLANNING

---

## Story Definition

### User Story

**En tant que** Développeur, **je veux** cloner le nouveau repo, installer les dépendances (`pnpm`) et vérifier les bindings dans `wrangler.toml`, **afin de** disposer d'un environnement de développement local fonctionnel connecté à Cloudflare.

### Story Context

Cette story fait suite à la Story 1.1 qui a provisionné l'infrastructure Cloudflare (Worker, D1, R2) via le template officiel. Maintenant que l'infrastructure est en place, les développeurs doivent pouvoir travailler localement avec une connexion aux services Cloudflare.

Le projet utilise Wrangler pour simuler localement les bindings D1 et R2, permettant un développement fluide sans déployer à chaque changement. La configuration locale doit être validée et documentée pour que tout membre de l'équipe puisse démarrer rapidement.

---

## Acceptance Criteria

### AC1: Clonage et Installation des Dépendances

- [ ] Le repository peut être cloné localement via `git clone`
- [ ] Les dépendances s'installent correctement avec `pnpm install`
- [ ] Aucune erreur de résolution de dépendances
- [ ] Les scripts npm/pnpm sont tous exécutables

### AC2: Configuration des Variables d'Environnement

- [ ] Fichier `.env` créé à partir de `.env.example`
- [ ] Variable `PAYLOAD_SECRET` configurée (génération aléatoire)
- [ ] Toutes les variables requises documentées
- [ ] Le fichier `.env` est dans `.gitignore`

### AC3: Vérification des Bindings Wrangler

- [ ] Le fichier `wrangler.jsonc` contient les bindings D1 corrects
- [ ] Le fichier `wrangler.jsonc` contient les bindings R2 corrects
- [ ] Les `compatibility_flags` incluent `nodejs_compat`
- [ ] Les types Cloudflare sont générés (`cloudflare-env.d.ts`)

### AC4: Serveur de Développement Fonctionnel

- [ ] La commande `pnpm dev` démarre sans erreur
- [ ] L'application est accessible sur `http://localhost:3000`
- [ ] La page d'accueil s'affiche correctement
- [ ] Le panneau admin est accessible sur `/admin`
- [ ] La connexion à D1 fonctionne (pas d'erreur de base de données)

### AC5: Génération des Types

- [ ] Les types Payload sont générés (`pnpm generate:types:payload`)
- [ ] Les types Cloudflare sont générés (`pnpm generate:types:cloudflare`)
- [ ] Le fichier `payload-types.ts` est à jour
- [ ] Le fichier `cloudflare-env.d.ts` est à jour
- [ ] Aucune erreur TypeScript dans le projet

### AC6: Documentation Locale

- [ ] Guide de démarrage rapide pour nouveaux développeurs
- [ ] Liste des commandes essentielles documentées
- [ ] Procédure de résolution des problèmes courants
- [ ] Configuration IDE recommandée (VSCode settings)

---

## Technical Requirements

### Prerequisites

- Node.js ^18.20.2 ou >=20.9.0
- pnpm ^9 ou ^10
- Wrangler CLI installé globalement ou via npx
- Accès au compte Cloudflare (authentification Wrangler)

### Key Files

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Configuration des bindings Cloudflare |
| `.env` | Variables d'environnement locales |
| `cloudflare-env.d.ts` | Types TypeScript pour l'environnement Cloudflare |
| `src/payload-types.ts` | Types générés par Payload CMS |
| `package.json` | Scripts et dépendances |

### Commands

```bash
# Installation
pnpm install

# Génération des types
pnpm generate:types

# Démarrage du serveur de développement
pnpm dev

# Démarrage propre (supprime les caches)
pnpm devsafe
```

---

## Dependencies

### Requires (Blocking)

- **Story 1.1**: Infrastructure Cloudflare doit être déployée
  - Repository GitHub créé
  - D1 database provisionnée
  - R2 bucket provisionné
  - Worker déployé

### Enables (Unblocks)

- **Story 1.3**: Pipeline Quality Gate (peut être développé en parallèle)
- **Story 2.x**: Toutes les stories de développement CMS nécessitent un environnement local

---

## Risk Assessment

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Problèmes d'authentification Wrangler | Medium | High | Documenter la procédure `wrangler login` |
| Incompatibilité de version Node.js | Low | Medium | Spécifier versions exactes, utiliser nvm |
| Erreurs de bindings locaux | Medium | Medium | Tester chaque binding individuellement |
| Conflits de ports locaux | Low | Low | Documenter comment changer le port |

### Technical Debt Considerations

- La configuration locale doit être suffisamment simple pour ne pas créer de friction
- Les scripts doivent fonctionner sur tous les OS (Windows, macOS, Linux)
- Éviter les dépendances sur des outils non standard

---

## Definition of Done

- [ ] Tous les critères d'acceptation validés
- [ ] Environnement local fonctionnel et testé
- [ ] Documentation complète et à jour
- [ ] Un nouveau développeur peut démarrer en < 15 minutes
- [ ] Aucune erreur TypeScript
- [ ] Aucune erreur ESLint
- [ ] Story 1.2 marquée comme complétée dans EPIC_TRACKING.md

---

## References

- **PRD**: `docs/specs/PRD.md` - Story 1.2 (ligne 299-301)
- **Epic Tracking**: `docs/specs/epics/epic_1/EPIC_TRACKING.md`
- **Story 1.1**: `docs/specs/epics/epic_1/story_1_1/story_1.1.md` (prérequis)
- **Wrangler Documentation**: https://developers.cloudflare.com/workers/wrangler/
- **Payload CMS Local Development**: https://payloadcms.com/docs/getting-started/installation

---

**Story Created**: 2025-11-28
**Created by**: Claude Code (story-phase-planner skill)
