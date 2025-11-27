
## Executive Summary

sebc.dev est un blog technique bilingue (français/anglais) tenu par un auteur unique. Il explore trois piliers fondamentaux : l'IA comme outil d'amplification, les principes d'UX, et les bonnes pratiques d'ingénierie logicielle. Chaque article illustre un apprentissage réel dans une logique _learning in public_. Pour garantir pérennité et vélocité, le projet repose sur **Payload CMS**, un CMS "code-first" moderne intégré nativement à Next.js, permettant une gestion de contenu puissante sur une architecture serverless Cloudflare.

## Problem Statement

- Les développeurs mid-level en startup manquent de ressources optimisant leur efficacité (time-to-value < 60s).
- Les juniors en apprentissage ont besoin de guidance progressive avec découverte rapide de patterns (< 3min).
- Les indie hackers/freelances recherchent une vue d'ensemble actionnable sans friction cognitive.
- Intégrer l'IA dans les workflows reste complexe et mal documenté.
- La gestion d'un blog technique bilingue "from scratch" entraîne souvent une dette technique sur la partie administration (Back-office).

## Proposed Solution

- Un blog bilingue centré sur l'expérience d'un développeur documentant ses apprentissages.
- **Architecture "Headless" unifiée** : Next.js servant à la fois de Front-end et de Backend CMS (via Payload).
- **Gestion de contenu professionnelle** : Utilisation de Payload CMS pour l'édition riche, la gestion des médias et l'i18n des données.
- Documentation transparente des parcours d'apprentissage, échecs, réussites et rétrospectives.
- Stack technique serverless : **Next.js 15 + Payload CMS 3.0 + Cloudflare Workers + D1 + R2**.

## Target Users

- **Développeurs mid-level en startup** : besoin d'efficacité maximale, solutions rapides.
- **Juniors en apprentissage** : guidance progressive, pédagogie claire.
- **Indie hackers/freelances** : vue d'ensemble stratégique, ROI clair.
- **Communauté technique francophone et anglophone** intéressée par l'IA, l'UX et les bonnes pratiques.

## Goals & Success Metrics

- **Court terme (V1)** : Lancement du blog avec Payload CMS, Hub de Recherche Avancée, publication régulière, 500+ lecteurs.
- **Moyen terme (Post-V1)** : Interactions communautaires, newsletter, audience > 2 000 abonnés.
- **Long terme** : Extension YouTube, opportunités organiques (partenariats, formations).

## MVP Scope (V1) — Architecture & Workflow

### Architecture Projet

- **Application Next.js 15** monolythe logique (Front + CMS) déployée sur Cloudflare Workers.
- **Payload CMS 3.0** monté sur les routes `/admin` et `/api`.
- **Base de données unifiée** : Cloudflare D1 accédée via Drizzle ORM (utilisé par Payload et le Front).
- **Architecture Serverless** : Pas de conteneurs, pas de VPS, tout tourne sur le Edge (via `workerd`).

### Stack Technique

- **Framework** : Next.js 15 (App Router).
- **CMS** : **Payload CMS 3.0** (Native Next.js).
- **Adaptateur Déploiement** : `@opennextjs/cloudflare`.
- **Base de données** : Cloudflare D1 via **Payload Drizzle Adapter**.
- **Stockage média** : Cloudflare R2 via **Payload Cloud Storage Plugin** (S3 compatible).
- **UI Front** : TailwindCSS 4 + shadcn/ui.
- **Runtime** : Cloudflare Workers.
- **CI/CD** : GitHub Actions avec Quality Gate "AI-Shield" (Socket.dev, Knip, Type Sync, Lighthouse CI).
- **Cache** : Next.js Cache API + Hooks de revalidation Payload (ISR).

### Fonctionnalités produit

- **Gestion de Contenu (Back-office Payload)** :
  - **Collections** : Articles, Catégories, Auteurs, Pages.
  - **Éditeur** : Lexical Editor (Riche, extensible, output JSON structuré).
  - **Localization** : Champs traductibles nativement (FR/EN) dans la base de données.
  - **Médias** : Upload direct vers R2 avec redimensionnement automatique.
  - **Live Preview** : Prévisualisation temps réel du front-end depuis l'admin.
  
- **Front-End Blog (Next.js)** :
  - **Internationalisation** : `next-intl` pour l'interface + contenu récupéré via Payload Local API en fonction de la locale.
  - **Hub de recherche avancée** : Filtrage performant via requêtes Drizzle/Payload (Catégories, Tags, Complexité, Durée).
  - **Rendu** : React Server Components (RSC) pour des performances optimales.
  - **UI/UX** : Identité visuelle distincte par catégorie, Table des matières auto-générée depuis le JSON Lexical.

- **Sécurité & Ops** :
  - **Auth Admin** : Payload Auth (Secure Cookies, JWT).
  - **Migrations** : Gestion des schémas D1 via `payload migrate`.
  - **Typesafety** : Génération automatique des types TypeScript depuis la config du CMS pour le Front.

### Sécurité & Opérations

- **Authentification V1** : Payload gère l'authentification des administrateurs (Collection `users`).
- **Configuration** :
  - `wrangler.toml` : Configuration infrastructure Cloudflare.
  - `payload.config.ts` : Configuration schéma CMS.
- **Secrets** : Gestion via `wrangler secret` et `.dev.vars`.
- **Monitoring** : Cloudflare Analytics + Logs structurés Payload.

### Qualité

- **Validation des données** : Zod (implicite dans Payload) + validation front-end.
- **Tests** : Vitest pour la logique métier, Playwright pour les parcours critiques.
- **SEO** : Plugin SEO Payload (gestion automatique des méta-titres, descriptions, OG tags).

## Future Vision (Post-V1 & Beyond)

- **Commentaires & Comptes lecteurs** : Utilisation de Payload Auth pour créer une collection "Members" (Lecteurs).
- **Newsletter** : Intégration d'un provider email via les Hooks Payload (ex: inscription automatique lors de la création d'un compte).
- **Wiki Ressources** : Nouvelle collection Payload avec relations complexes (liens croisés).

## Principes Architecturaux Clés (Mise à jour Payload)

1.  **Code-First CMS** : La configuration du CMS (collections, champs) est définie en TypeScript (`payload.config.ts`), garantissant le versionning et la type-safety.
2.  **Edge-Ready** : Tout le code, y compris le CMS, doit être compatible avec le runtime `workerd` (pas de dépendances Node.js natives lourdes comme `sharp` standard -> utiliser alternatives WASM si nécessaire ou les services Cloudflare Images).
3.  **Local API First** : Le Front-end (App Router) communique avec le CMS via l'API Locale de Payload (appels de fonction directs) plutôt que par HTTP, éliminant la latence réseau.
4.  **Single Source of Truth** : Le schéma de base de données est géré par Payload/Drizzle. Pas de modifications manuelles SQL sur D1.
5.  **Adaptateur OpenNext** : Utilisation stricte de `@opennextjs/cloudflare` pour assurer la compatibilité Next.js 15 + Payload sur Workers.

## Risks & Open Questions

**Risks**
- **Cold Starts** : Payload est une application conséquente ; sur Cloudflare Workers, le temps de démarrage à froid peut être perceptible (nécessité d'optimiser le bundling).
- **Compatibilité Node** : Certaines dépendances de plugins Payload pourraient ne pas être compatibles avec le runtime Edge (surveillance des `compatibility_flags`).

**Open Questions**
- Stratégie de redimensionnement d'images : Utiliser le redimensionnement intégré de Payload (gourmand en CPU Worker) ou déléguer à Cloudflare Images ? (Recommandation : Cloudflare Images).
- Gestion des migrations D1 en CI/CD avec Payload : Validation du workflow `payload migrate` dans les GitHub Actions.

## CI/CD Quality Gate "AI-Shield"

Pipeline GitHub Actions avec validation multi-couches pour protéger contre les hallucinations IA et garantir la qualité du code :

- **Supply Chain** : Socket.dev (blocage paquets malveillants, typosquatting)
- **Code Quality** : Knip (code mort), ESLint/Prettier, Type sync Payload ↔ TypeScript
- **Performance** : Lighthouse CI (budgets stricts : Performance > 90, A11y = 100, SEO = 100)
- **Architecture** : dependency-cruiser (interdiction imports serveur ↔ client)
- **Security** : SHA pinning actions GitHub, OIDC Cloudflare (Phase 2)

> **Documentation complète :** [CI-CD Security Architecture](./CI-CD-Security.md)