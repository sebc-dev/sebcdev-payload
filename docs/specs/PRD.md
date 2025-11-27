---
created: 2025-11-26T06:50
updated: 2025-11-26T22:01
---
## Objectifs et Contexte

### Objectifs

- **Lancement V1 :** Déployer le blog bilingue avec Payload CMS 3.0 en production sur Cloudflare Workers.
- **Performance & DX :** Atteindre un _time-to-value_ < 60s pour le lecteur et une expérience d'administration fluide pour l'auteur (pas de dette technique back-office).
- **Fonctionnalités Clés :** Mettre en place l'i18n natif (contenu et UI) et le Hub de Recherche Avancée.
- **Audience :** Atteindre 500+ lecteurs réguliers grâce à un contenu technique qualitatif ("Learning in public").
- **Architecture :** Valider la stack Serverless/Edge (D1 + R2) sans dépendances Node.js lourdes.

### Contexte

sebc.dev est conçu pour être un blog technique de référence pour les développeurs mid-level, juniors et indie hackers, traitant de l'IA, de l'UX et de l'ingénierie logicielle. Le marché actuel manque de ressources qui allient profondeur technique et rapidité de consommation.

Le projet vise à résoudre la friction cognitive liée à la gestion de blogs techniques multilingues classiques en adoptant une architecture "Code-First". En unifiant le Front-end (Next.js 15) et le CMS (Payload 3.0) dans une application monolithique logique déployée sur le Edge (Cloudflare), nous éliminons la latence réseau API et garantissons une pérennité technique maximale.
C'est entendu. Voici la section complète des **Exigences (Requirements)**, consolidée et mise au format strict que nous avons défini pour ENF28 (Description + Liste de CA détaillés).

## Exigences

### Exigences Fonctionnelles

#### EF1 — Gestion de Contenu (Auteur Unique)

**Description** : Le système permet à un auteur unique de gérer l'intégralité du contenu via Payload CMS, avec une taxonomie pré-configurée.

**Critères d'acceptation** :

- **CA1** : L'accès administrateur permet de créer/éditer/supprimer des Articles, Pages, Catégories et Tags.
- **CA2** : La gestion des utilisateurs est restreinte à un profil auteur unique pour la V1.
- **CA3** : Un script de "seed" initialise la base de données avec les 9 catégories canoniques (Actualités, Tutoriel, Rétrospective, etc.) définies dans la stratégie de contenu.


#### EF2 — Expérience d'Édition Riche & Structurée

**Description** : L'éditeur de contenu (Lexical) produit un format structuré permettant des fonctionnalités de lecture avancées côté Front-end.

**Critères d'acceptation** :

- **CA1** : L'éditeur supporte le texte riche, les blocs de code, les citations et les uploads d'images.
- **CA2** : Le système génère automatiquement une Table des Matières (TOC) basée sur la hiérarchie des titres (h2, h3) du JSON Lexical.
- **CA3** : Le système calcule et persiste le "Temps de lecture estimé" (global) lors de la sauvegarde de l'article.


#### EF3 — Internationalisation Native (i18n)

**Description** : Le site est entièrement bilingue (FR/EN), géré nativement depuis la base de données jusqu'à l'interface.

**Critères d'acceptation** :

- **CA1** : Les champs de contenu (Titre, Corps, SEO) sont localisés dans Payload (champs `localized: true`).
- **CA2** : L'interface utilisateur (menus, boutons) est traduite via `next-intl`.
- **CA3** : Mécanisme de Fallback : si une traduction est manquante, le contenu s'affiche dans la langue par défaut avec un indicateur visuel approprié.

#### EF4 — Hub de Recherche Avancée

**Description** : Une interface de recherche performante permet de filtrer le contenu dynamiquement sans rechargement de page.

**Critères d'acceptation** :

- **CA1** : Filtrage instantané par : Recherche textuelle, Catégorie, Tags, Complexité, Durée de lecture et Date de publication.
- **CA2** : L'état des filtres est synchronisé dans l'URL (Search Params) pour permettre le partage de recherches.
- **CA3** : L'implémentation utilise l'API Locale de Payload (`payload.find`) via des React Server Components pour une performance optimale.

#### EF5 — Gestion des Médias Edge

**Description** : Le pipeline de gestion des images est optimisé pour le Edge (R2 + Cloudflare Images).

**Critères d'acceptation** :

- **CA1** : L'upload depuis le Back-office envoie les fichiers directement vers un bucket Cloudflare R2 (via plugin Payload Cloud Storage).
- **CA2** : Le Front-end sert les images via un loader `next/image` configuré pour utiliser le service de transformation Cloudflare Images (WebP/AVIF auto, redimensionnement).

#### EF6 — Live Preview

**Description** : L'auteur peut visualiser le rendu final de son contenu avant publication.

**Critères d'acceptation** :

- **CA1** : Le Back-office Payload affiche une vue scindée (Split View) avec le formulaire à gauche et le rendu Next.js à droite.
- **CA2** : La prévisualisation se met à jour en temps réel (ou quasi-réel) lors de la modification des champs, sans nécessiter de sauvegarde.

#### EF7 — Identité Visuelle Dynamique

**Description** : L'interface s'adapte visuellement pour renforcer le contexte de la catégorie consultée.

**Critères d'acceptation** :

- **CA1** : La collection "Catégories" dans Payload inclut des champs de configuration visuelle (Sélecteur de couleur HEX, Icône).
- **CA2** : Le Front-end utilise ces métadonnées pour colorer dynamiquement les badges, les bordures ou les accents de la page article.

#### EF8 — UX de Lecture

**Description** : Des composants spécifiques améliorent le confort de lecture des articles longs.

**Critères d'acceptation** :

- **CA1** : Une barre de progression de lecture est affichée en haut de la fenêtre (sticky) lors du défilement.
- **CA2** : Les articles sont présentés sous forme de cartes homogènes (Image, Titre, Extrait, Métadonnées) dans toutes les listes du site.

### Exigences Non-Fonctionnelles

#### ENF1 — Architecture Edge-Ready

**Description** : L'application est conçue pour s'exécuter exclusivement sur le Edge (Cloudflare Workers).

**Critères d'acceptation** :

- **CA1** : Le build Next.js et le runtime Payload sont compatibles avec le flag `nodejs_compat` de `workerd`.
- **CA2** : Aucune dépendance Node.js native (C++ bindings) non supportée par Workers n'est utilisée.
- **CA3** : L'architecture est un Monorepo logique déployé via l'adaptateur `@opennextjs/cloudflare`.

#### ENF2 — Performance & Web Vitals

**Description** : Le site offre une expérience instantanée pour l'utilisateur final.

**Critères d'acceptation** :

- **CA1 (Time-to-Value)** : Le contenu principal est accessible en < 60s (perception utilisateur).
- **CA2 (LCP)** : Largest Contentful Paint < 2.5s sur mobile 4G.
- **CA3 (CLS)** : Cumulative Layout Shift < 0.1.
- **CA4** : Utilisation du cache Next.js (`unstable_cache`) et révalidation ISR via les Hooks Payload.

#### ENF3 — Intégrité des Données

**Description** : La base de données est gérée de manière stricte et unifiée.

**Critères d'acceptation** :

- **CA1** : Stockage sur Cloudflare D1.
- **CA2** : Accès via Drizzle ORM uniquement.
- **CA3** : Le schéma Payload est la "Single Source of Truth" ; les modifications de schéma SQL se font exclusivement via les migrations générées par Payload.

#### ENF4 — SEO Technique

**Description** : Le site est techniquement optimisé pour les moteurs de recherche dès la V1.

**Critères d'acceptation** :

- **CA1** : Génération automatique et dynamique du `sitemap.xml` et du `robots.txt`.
- **CA2** : Implémentation correcte des balises `hreflang` pour le contenu bilingue.
- **CA3** : Génération dynamique des métadonnées OpenGraph (titre, description, image) pour chaque page.

#### ENF5 — Sécurité

**Description** : L'accès administratif et l'application sont sécurisés selon les standards industriels.

**Critères d'acceptation** :

- **CA1** : L'accès à la route `/admin` est protégé par l'authentification Payload (HttpOnly Cookies, CSRF, Secure).
- **CA2** : Une Content Security Policy (CSP) stricte est configurée via les headers HTTP.

#### ENF6 — Souveraineté du Code & Sécurité Supply Chain (AI-Shield)

**Description** : Pipeline CI/CD configuré pour détecter et bloquer les hallucinations, les failles architecturales et les tests superficiels.

> **Documentation détaillée :** Voir [CI-CD Security Architecture](./CI-CD-Security.md) pour l'architecture complète de sécurité et la roadmap d'implémentation en 3 phases.

**Critères d'acceptation (Organisation par phase) :**

**Phase 1 - MVP (Essentials) :**
- **CA1 (Sécurité)** : Action **Socket.dev** bloquante contre les paquets malveillants.
- **CA2 (Hygiène)** : Action **Knip** pour rejeter le code mort.
- **CA3 (Type Sync)** : Vérification stricte des types Payload.
- **CA4 (Build)** : Validation `next build --experimental-build-mode compile` sans DB.
- **CA5 (Style)** : Prettier + plugin Tailwind (ordre déterministe).

**Phase 2 - Enhanced (Monitoring & Performance) :**
- **CA6 (A11y)** : Tests Playwright + `axe-core`.
- **CA7 (Architecture)** : Intégration de **dependency-cruiser** pour interdire les imports non conformes (ex: code serveur importé dans un composant client).
- **CA9 (Performance Shield)** : Intégration de **Lighthouse CI** avec budgets stricts (Performance > 90, Accessibility = 100, SEO = 100).

**Phase 3 - Advanced (Robustness) :**
- **CA8 (Robustesse des Tests)** : Intégration de **Stryker** (Mutation Testing) exécuté sur les fichiers critiques (`src/lib/`, Server Actions).

**Sécurité Pipeline :**
- SHA Pinning des actions GitHub tierces (immuabilité cryptographique)
- OIDC pour authentification Cloudflare (élimine secrets statiques) - Phase 2
- Permissions GITHUB_TOKEN en read-only par défaut
- Dependabot pour maintenance automatique des dépendances

## Objectifs de Design Interface Utilisateur

Pour cette section, j'ai fusionné la stack technique moderne du nouveau Brief (Tailwind 4 + shadcn/ui) avec la direction artistique très précise et sophistiquée définie dans l'ancien PRD (Dark mode, typographie, palette).

Voici la proposition :

### Vision UX Globale

- **Esthétique :** "Dark mode sophistiqué" par défaut. Une interface professionnelle, minimaliste et immersive, inspirée des standards "DevTools" modernes (ex: Supabase, Auth0).
- **Priorité au Contenu :** Densité d'information optimisée pour la lecture technique longue durée. Pas de distractions visuelles inutiles.
- **Identité Adaptative :** L'ambiance visuelle (accents, badges) s'adapte subtilement selon la catégorie technique consultée (ex: "Tutoriel" vs "News") pour renforcer le contexte.

### Paradigmes d'Interaction Clés

- **Performance-First :** Les transitions de page et les filtrages doivent être perçus comme instantanés (optimistic UI).
- **Navigation Clavier :** Les développeurs étant la cible principale, la navigation au clavier (Tab, raccourcis recherche) doit être citoyenne de première classe.
- **Découverte Rapide :** Le Hub de recherche doit permettre de scanner visuellement les résultats (Badges de complexité, Temps de lecture) très rapidement (< 3 min pour trouver un pattern).

### Branding & Style Guide

- **Palette de Couleurs :**
    
    - **Fond :** Gris anthracite profond (`#1A1D23`) pour réduire la fatigue oculaire.
    - **Accent Primaire :** Vert canard lumineux (`#14B8A6`) pour les actions principales et liens.
    - **Code couleur Catégories :** Une palette secondaire définie pour les 9 catégories canoniques.

- **Typographie :**
    
    - **Corps/Titres :** `Inter` ou `Nunito Sans` pour une lisibilité maximale.
    - **Code/Technique :** `JetBrains Mono` pour tous les blocs de code et terminologies techniques.
        
- **Composants UI :** Base `shadcn/ui` (Radix UI) personnalisée pour correspondre à l'identité "Dark mode", avec des bordures subtiles et des micro-interactions soignées.
    

### Écrans Clés

1. **Homepage :** Hero section minimaliste, grille des derniers articles, accès rapide aux catégories.
2. **Article View :** Colonne centrale de lecture (max-width optimisé ~65ch), TOC latérale (desktop) ou flottante (mobile), blocs de code syntax-highlighted.
3. **Hub de Recherche :** Sidebar de filtres (facettes) à gauche, grille de résultats réactive à droite.

### Accessibilité & Plateformes

- **Cible :** Web Responsive (Mobile First), optimisé pour Desktop (contexte de travail développeur).
- **Standard :** Conformité WCAG 2.1 AA (Contraste texte/fond ≥ 4.5:1, zones interactives ≥ 44px).
- **Préférences :** Support du `prefers-reduced-motion`.

### Objectifs de Performance & Qualité

- **Performance :** Score cible **≥ 95/100** (Mobile & Desktop).
- **Accessibilité :** Score cible **100/100** (Aucune erreur a11y tolérée).
- **Best Practices :** Score cible **100/100**.
- **SEO :** Score cible **100/100** (Structure sémantique parfaite, méta-données complètes).

## Structure du Répertoire

- **Type :** **Monorepo Logique** (Single Repo).
    
- **Organisation :** Application Next.js 15 standard.
    
    - `/app` : Routes Front-end (App Router).
    - `/app/(payload)/admin` : Routes du Back-office Payload.
    - `/src/payload.config.ts` : Configuration du CMS (Collections, Globals).
    - `/src/lib` : Code partagé, utilitaires, composants UI.
        
- **Rationale :** Simplifie le déploiement sur Cloudflare Workers (un seul Worker pour tout gérer) et partage le code (types Drizzle, composants) entre le Front et le CMS sans packages complexes.
    
### Architecture de Service

- **Style :** **Serverless / Edge-First**.
- **Runtime :** Cloudflare Workers via l'adaptateur `@opennextjs/cloudflare`.
- **Contrainte Critique :** Tout le code (y compris les plugins Payload) doit être compatible avec le flag `nodejs_compat` de `workerd`. Pas de dépendances binaires Node.js natives (comme `sharp` standard -> utilisation des services Cloudflare Images ou alternatives WASM).
- **Base de Données :** **Cloudflare D1** (SQLite distribué) accédée via **Drizzle ORM**. C'est la "Single Source of Truth" pour le CMS et le Front.
- **Stockage Média :** **Cloudflare R2** (S3-compatible) géré par le plugin Payload Cloud Storage.

### Exigences de Tests

- **Unitaires & Logique Métier :** **Vitest**. Rapide, compatible Vite/Next.js. Cible : Utilitaires, Hooks, Logique de transformation de données.
- **End-to-End (E2E) & Parcours Critiques :** **Playwright**. Cible : Parcours de lecture, Fonctionnement du Hub de recherche, Login Admin (si possible).
- **Architecture :** `dependency-cruiser` pour valider l'étanchéité entre les composants Client et Server.

### Hypothèses Supplémentaires

- **API Locale First :** Le Front-end (Server Components) doit communiquer avec Payload via l'**API Locale** (appels de fonctions directs) et non par requêtes HTTP (REST/GraphQL), pour éliminer la latence réseau et le surcoût de sérialisation.
- **Migrations :** Les changements de schéma D1 sont gérés exclusivement via les migrations Payload/Drizzle (`payload migrate`) exécutées dans le pipeline CI/CD.
- **Cache :** Utilisation de l'API Cache de Next.js (`unstable_cache`, `revalidateTag`) couplée aux Hooks `afterChange` de Payload pour purger le cache (ISR) lors des mises à jour de contenu.

## Liste des Épics et User Stories
### 🧱 Epic 1 : Foundation & Cloudflare Architecture

_Objectif : Déployer le socle technique via le template officiel et sécuriser le pipeline CI/CD._

- **Story 1.1 : Initialisation & Déploiement 1-Click**
    - **En tant que** Développeur, **je veux** utiliser le bouton "Deploy to Cloudflare" du template officiel `with-cloudflare-d1`, **afin de** provisionner automatiquement le Repo GitHub, la base D1, le bucket R2 et le Worker.
- **Story 1.2 : Récupération & Configuration Locale**
    - **En tant que** Développeur, **je veux** cloner le nouveau repo, installer les dépendances (`pnpm`) et vérifier les bindings dans `wrangler.toml`, **afin de** disposer d'un environnement de développement local fonctionnel connecté à Cloudflare.
- **Story 1.3 : Pipeline "Quality Gate" (AI-Shield)**
    - **En tant que** Lead Tech, **je veux** configurer un workflow GitHub Actions exhaustif comprenant :
        1. **Socket.dev** (Sécurité Supply Chain).
        2. **Knip** (Nettoyage code mort).
        3. **Dependency Cruiser** (Validation architecture).
        4. **Stryker** (Mutation Testing sur modules critiques).
        5. **Lighthouse CI** (Audit Performance & SEO bloquant).
        6. **ESLint/Prettier** & Sync des Types Payload.
    - **Afin de** garantir une base de code saine, sécurisée et performante avant toute fusion.
- **Story 1.4 : Adaptation du Pipeline de Déploiement**
    - **En tant que** DevOps, **je veux** conditionner le script de déploiement Cloudflare (`wrangler deploy`) à la réussite préalable de la "Quality Gate", **afin d'** empêcher toute mise en production de code non conforme ou insécurisé.

### 📝 Epic 2 : Content Management System (CMS) Core

_Objectif : Configurer le métier du blog sur l'infrastructure Payload._

- **Story 2.1 : Configuration des Collections Blog & i18n**
    - **En tant qu'** Auteur, **je veux** créer les collections `Articles` et `Pages` avec l'option `localized: true` sur les champs de contenu (Titre, Corps, SEO), **afin de** gérer mon contenu en Français et Anglais.
- **Story 2.2 : Validation du Stockage R2**
    - **En tant qu'** Auteur, **je veux** uploader une image test depuis le panneau admin et vérifier sa présence dans le bucket R2, **afin de** valider que le plugin Cloud Storage est correctement configuré par le template.
- **Story 2.3 : Éditeur Lexical & Seed Data**
    - **En tant qu'** Auteur, **je veux** disposer d'un éditeur Lexical configuré avec les blocs "Code", "Citation" et "Image", et exécuter un script de seed pour créer les 9 catégories canoniques, **afin de** commencer à rédiger du contenu structuré immédiatement.

### 🎨 Epic 3 : Frontend Core & Design System

_Objectif : Construire l'identité visuelle et la navigation bilingue._

- **Story 3.1 : Routing i18n & Middleware**
    - **En tant qu'** Utilisateur, **je veux** que l'URL reflète ma langue (`/fr` ou `/en`) et que ma préférence soit sauvegardée, **afin de** naviguer dans une interface localisée via `next-intl`.
- **Story 3.2 : Intégration Design System (Dark Mode)**
    - **En tant que** Développeur, **je veux** installer **Tailwind 4** et **shadcn/ui** et appliquer la charte graphique "Anthracite & Vert Canard", **afin de** remplacer le style par défaut du template par l'identité de la marque.
- **Story 3.3 : Layout Global & Navigation**
    - **En tant qu'** Utilisateur, **je veux** voir un Header et un Footer cohérents sur toutes les pages, incluant un sélecteur de langue fonctionnel, **afin de** naviguer aisément dans le site.

### 📖 Epic 4 : Article Reading Experience

_Objectif : Offrir un confort de lecture optimal pour les articles techniques._

- **Story 4.1 : Rendu Article & MDX**
    - **En tant que** Lecteur, **je veux** voir le contenu riche (code syntax-highlighted, images, mise en forme) s'afficher correctement via les React Server Components, **afin de** lire les articles techniques confortablement.
- **Story 4.2 : Table des Matières (TOC) & Progression**
    - **En tant que** Lecteur, **je veux** voir une barre de progression de lecture en haut de page et une Table des Matières cliquable, **afin de** me repérer dans les contenus longs.
- **Story 4.3 : Live Preview**
    - **En tant qu'** Auteur, **je veux** utiliser le mode "Live Preview" de Payload pour voir mes modifications en temps réel sur le frontend Next.js (écran scindé), **afin d'** ajuster la mise en page avant publication.

### 🔍 Epic 5 : Search & Discovery Hub

_Objectif : Faciliter la découverte et le filtrage des contenus._

- **Story 5.1 : API de Recherche (Payload Local)**
    - **En tant que** Développeur, **je veux** implémenter des fonctions de recherche utilisant l'API Locale de Payload (`payload.find`), **afin de** requêter le contenu sans latence réseau HTTP.
- **Story 5.2 : Interface de Filtrage Dynamique**
    - **En tant qu'** Utilisateur, **je veux** filtrer les articles par Catégorie, Complexité, Durée et Date sans rechargement de page (via URL Search Params), **afin de** trouver rapidement un sujet précis.
- **Story 5.3 : Cartes Articles & Pagination**
    - **En tant qu'** Utilisateur, **je veux** consulter les résultats sous forme de cartes riches (Titre, Extrait, Badges) avec une pagination fluide, **afin de** parcourir le catalogue efficacement.

### 🚀 Epic 6 : SEO & Performance Optimization

_Objectif : Maximiser la visibilité moteur et la vitesse de chargement._

- **Story 6.1 : Méta-données & Sitemap**
    - **En tant que** Moteur de Recherche, **je veux** accéder à un `sitemap.xml` dynamique et lire des balises Méta/OpenGraph optimisées sur chaque page, **afin d'** indexer correctement le site.
- **Story 6.2 : Optimisation Images (Cloudflare Loader)**
    - **En tant qu'** Utilisateur, **je veux** que les images soient servies au format WebP/AVIF et redimensionnées via Cloudflare Images (loader `next/image` custom), **afin de** réduire le temps de chargement et la consommation de données.
- **Story 6.3 : Stratégie de Cache ISR**
    - **En tant qu'** Utilisateur, **je veux** que les pages soient servies depuis le cache Edge (avec revalidation via les Hooks Payload), **afin d'** obtenir un affichage quasi-instantané (Time-to-Value < 60s).

### 🛡️ Epic 7 : Quality Assurance & Hardening

_Objectif : Valider la robustesse et la sécurité avant lancement._

- **Story 7.1 : Tests E2E (Parcours Critiques)**
    - **En tant que** QA, **je veux** exécuter des tests Playwright sur les parcours critiques (Navigation, Recherche, Lecture), **afin de** garantir l'absence de régressions fonctionnelles.
- **Story 7.2 : Audit Sécurité & Accessibilité**
    - **En tant qu'** Auditeur, **je veux** vérifier que le site respecte les normes WCAG (Accessibilité) et applique une CSP stricte, **afin de** garantir un site sûr et inclusif pour tous.
