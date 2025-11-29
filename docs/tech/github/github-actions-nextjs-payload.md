# **Architecture de Robustesse et Souveraineté du Code : Stratégies CI/CD pour l'Écosystème Next.js, Payload CMS 3 et ShadCN sous Assistance IA**

## **1. Introduction : Le Nouveau Paradigme du Développement Assisté par l'IA**

L'intégration massive de l'intelligence artificielle générative (GenAI) dans les flux de travail de développement logiciel marque une rupture fondamentale avec les méthodes traditionnelles. Dans le contexte spécifique d'une application de blog moderne, architecturée autour de **Next.js (App Router)**, **Payload CMS 3**, **TailwindCSS** et **ShadCN**, l'IA agit comme un accélérateur de vélocité sans précédent. Elle permet de prototyper des composants d'interface complexes, de définir des schémas de données relationnels et d'échafauder des logiques métier en quelques secondes. Cependant, cette capacité de production accélérée introduit une nouvelle catégorie de risques techniques et de sécurité : la "dette technique instantanée".  
Contrairement au code produit par un développeur humain, qui suit généralement une progression logique et contextuelle, le code généré par l'IA peut être syntaxiquement correct mais structurellement incohérent, stylistiquement erratique, ou basé sur des hallucinations de bibliothèques inexistantes. Pour une stack technologique aussi intégrée que Payload CMS 3 — qui fusionne le backend CMS directement dans l'infrastructure Next.js — ces approximations peuvent avoir des conséquences dévastatrices sur la stabilité du déploiement et l'intégrité des données.  
Ce rapport propose une analyse approfondie des mécanismes de défense nécessaires pour transformer un pipeline d'Intégration Continue et de Déploiement Continu (CI/CD) sur GitHub Actions en un véritable système immunitaire numérique. L'objectif n'est pas seulement d'automatiser les tests, mais d'établir une gouvernance rigoureuse capable de valider, assainir et sécuriser le code produit par l'IA avant qu'il n'atteigne l'environnement de production. Nous explorerons les interactions subtiles entre les Server Components de Next.js, la gestion des types de Payload, et l'architecture "copier-coller" de ShadCN, en définissant pour chaque couche les actions GitHub indispensables pour garantir une qualité de code irréprochable.

---

## **2. L'Architecture de Build Payload CMS 3 et Next.js : Le Défi de la Connexion Base de Données**

L'un des défis les plus critiques et spécifiques à l'adoption de Payload CMS 3 réside dans son architecture native à Next.js. Contrairement aux versions précédentes (Payload 2.0) qui fonctionnaient souvent comme des serveurs Express séparés, la version 3 s'exécute au sein même de l'instance Next.js.3 Cette unification simplifie le déploiement mais complexifie considérablement le processus de build dans un environnement CI éphémère et sans état (stateless).

### **2.1 Le Paradoxe de la Génération Statique et de la Connexion DB**

Lorsqu'un pipeline CI déclenche la commande standard de construction (npm run build ou next build), Next.js tente par défaut d'optimiser l'application en pré-calculant le rendu des pages (Static Site Generation \- SSG). Si votre application de blog utilise Payload pour récupérer le contenu des articles via l'API Locale (payload.find()) lors de cette phase, le processus de build tente impérativement d'établir une connexion à la base de données (PostgreSQL ou MongoDB).  
Dans un environnement GitHub Actions standard, cette tentative se solde fréquemment par un échec critique pour plusieurs raisons :

1. **Absence de Base de Données :** Le runner CI (ex: ubuntu-latest) est une machine vierge qui ne contient pas votre base de données.
2. **Sécurité et Réseau :** La base de données de production est souvent isolée dans un sous-réseau privé (VPC) inaccessible depuis les IPs publiques de GitHub Actions pour des raisons de sécurité évidentes.
3. **Gestion des Secrets :** Fournir les clés d'accès à la base de production dans l'environnement CI viole le principe de moindre privilège et expose l'infrastructure à des risques de fuite via des scripts malveillants ou des logs verbeux.

Les symptômes typiques de ce blocage incluent des erreurs de type "Missing Secret Key", des timeouts de connexion MongoDB/Postgres, ou des erreurs de chargement de chunks (ChunkLoadError) dues à une configuration Webpack incomplète pour le mode serveur.

### **2.2 Stratégie de Résolution : Le Mode de Build "Compile-Only"**

Pour résoudre ce paradoxe sans sacrifier la sécurité, il est impératif d'adopter une stratégie de build découplée. Next.js, en collaboration avec l'équipe Payload, a introduit des modes de build expérimentaux qui permettent de séparer la compilation du code de la génération des données.  
L'analyse des meilleures pratiques actuelles identifie l'utilisation du flag \--experimental-build-mode compile comme la solution indispensable pour les pipelines CI.5 Cette commande instruit Next.js de transformer le code TypeScript/React en artefacts JavaScript exécutables, de générer les manifestes de build et de valider la syntaxe, _sans_ tenter d'exécuter les fonctions generateStaticParams ou de pré-rendre les pages qui dépendent de données dynamiques via Payload.  
**Tableau 1 : Comparaison des Stratégies de Build pour Payload 3 en CI**

| Stratégie             | Commande                                     | Avantages                                                              | Inconvénients                                                     | Contexte d'Usage                             |
| :-------------------- | :------------------------------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------- | :------------------------------------------- |
| **Standard**          | next build                                   | Validation complète (code + données).                                  | Requiert une connexion DB active. Lent. Risque de sécurité élevé. | Développement local uniquement.              |
| **Service Container** | next build + Docker Postgres                 | Teste l'intégration réelle DB.                                         | Lourd à configurer. Augmente le temps de CI (setup container).    | Tests d'intégration (E2E).                   |
| **Compile-Only**      | next build --experimental-build-mode compile | Extrêmement rapide. Aucune DB requise. Valide la syntaxe et les types. | Ne détecte pas les erreurs de rendu runtime.                      | **Recommandé pour la validation CI rapide.** |

**Implémentation Technique dans GitHub Actions :**  
L'action indispensable ici n'est pas un plugin tiers, mais une configuration précise de l'étape de build native. Il est crucial de fournir des variables d'environnement "fictives" (placeholders) pour satisfaire les validateurs de schéma de Payload (comme Zod), même si aucune connexion réelle n'est établie.

```yaml
jobs:
  build-verification:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application (Compile Mode)
        # Indispensable pour éviter la connexion DB
        run: npx next build \--experimental-build-mode compile
        env:
          # Valeurs fictives pour passer la validation statique de la config Payload
          PAYLOAD_SECRET: 'ci-placeholder-secret-strictly-for-build'
          DATABASE_URI: 'postgres://user:pass@localhost:5432/db\_placeholder'
          NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000'
```

## Cette approche garantit que le code généré par l'IA est structurellement valide et compilable, éliminant les erreurs de syntaxe ou d'importation sans bloquer le pipeline sur des dépendances d'infrastructure.

## **3. Sécurité de la Chaîne d'Approvisionnement : Contrer les Hallucinations de l'IA**

L'utilisation intensive de l'IA pour la génération de code introduit un vecteur d'attaque sophistiqué et souvent ignoré : les hallucinations de paquets (Package Hallucinations) et le "Slopsquatting". Les modèles de langage (LLM), entraînés sur de vastes corpus de code open-source, ont tendance à "inventer" des noms de paquets npm qui semblent logiques mais n'existent pas (par exemple, next-payload-auth-v3 ou shadcn-ui-datepicker).

### **3.1 La Menace du Slopsquatting et des Dépendances Fantômes**

Les attaquants surveillent activement ces hallucinations courantes. Lorsqu'ils identifient un nom de paquet fréquemment suggéré par des IA mais non enregistré sur le registre npm, ils publient un paquet malveillant sous ce nom exact. Si un développeur copie-colle aveuglément la commande npm install suggérée par l'IA, ou si l'IA génère un package.json incluant cette dépendance, le pipeline CI téléchargera et exécutera ce code malveillant.
Une fois installé, ce paquet peut exécuter des scripts de post-installation (postinstall) pour exfiltrer les variables d'environnement (secrets API, clés AWS) présentes dans l'environnement CI vers un serveur tiers.10 Pour un projet Payload CMS qui manipule des données sensibles, ce risque est inacceptable.

### **3.2 Outils de Défense Indispensables : Socket.dev vs Lockfile-lint**

La défense traditionnelle basée sur l'analyse des vulnérabilités connues (CVE) via npm audit est inefficace ici, car ces paquets malveillants sont nouveaux (Zero-Day) et n'ont pas encore de CVE associées. Il est nécessaire d'utiliser des outils d'analyse comportementale et de réputation.  
Socket.dev : L'Analyste de Comportement  
L'action GitHub Socket.dev est identifiée comme la solution la plus robuste pour contrer les risques spécifiques à l'IA.12 Contrairement aux scanners statiques, Socket analyse le comportement du code contenu dans le paquet. Il détecte :

- L'utilisation d'API privilégiées (réseau, système de fichiers, child_process) dans des paquets qui ne devraient pas en avoir besoin (ex: un composant UI qui tente d'ouvrir une connexion réseau).
- Les paquets "typosquattés" (noms très proches de paquets populaires).
- L'installation de scripts suspects.

Lockfile-lint : La Validation de Provenance  
En complément ou en alternative légère, Lockfile-lint permet de restreindre les sources autorisées pour les paquets. Il assure que tous les paquets proviennent du registre npm officiel et non d'URL Git suspectes ou de registres HTTP non sécurisés que l'IA pourrait halluciner.  
**Tableau 2 : Comparaison des Outils de Sécurité Supply Chain**

| Fonctionnalité               | npm audit | lockfile-lint | socket.dev |
| :--------------------------- | :-------- | :------------ | :--------- |
| Détection CVE connues        | ✅        | ❌            | ✅         |
| Validation source (Registry) | ❌        | ✅            | ✅         |
| Détection Malware Zero-Day   | ❌        | ❌            | ✅         |
| Analyse comportementale      | ❌        | ❌            | ✅         |
| Protection Hallucination IA  | Faible    | Moyenne       | **Élevée** |

**Action Indispensable à Intégrer :**  
L'intégration de l'action Socket.dev doit être configurée pour bloquer le build (blocking: true) si une menace critique est détectée. C'est le pare-feu indispensable entre les suggestions de l'IA et votre base de code.

```yaml
- name: Supply Chain Security Scan (Socket.dev)
  uses: socket-dev/action@v1.0.0
  with:
    api-token: ${{ secrets.SOCKET_SECURITY_API_TOKEN }}
    blocking: true # Bloque le pipeline en cas de détection de malware
```

Si l'usage de Socket.dev n'est pas possible, lockfile-lint est le minimum vital :

```yaml
- name: Validate Lockfile Integrity
  run: npx lockfile-lint --path package-lock.json --type npm --allowed-hosts npm --validate-https
```

## Cette couche de sécurité garantit que même si l'IA introduit une "bombe à retardement" sous forme de dépendance obscure, le pipeline CI la désamorcera avant l'installation.

## **4. Cohérence des Données et Typage : La Synchronisation Payload-TypeScript**

Dans un écosystème TypeScript strict comme celui imposé par Next.js et Payload, la vérité des données réside dans les types. Payload CMS 3 génère automatiquement des interfaces TypeScript basées sur la configuration de vos Collections et Globals. Cependant, l'IA a tendance à modifier les composants React (Frontend) en assumant des structures de données qui ne correspondent pas toujours à la configuration réelle du CMS (Backend), ou inversement.

### **4.1 Le Risque de Désynchronisation des Types**

Si l'IA modifie une collection Payload (par exemple, en rendant un champ image obligatoire) sans mettre à jour les types TypeScript générés, le build peut réussir techniquement mais l'application plantera au runtime ou présentera des types any implicites, masquant des erreurs. De plus, il est fréquent que les types générés ne soient pas committés ou soient obsolètes dans le dépôt Git.

### **4.2 Stratégie de "Vérité Terrain" en CI**

Il est indispensable d'automatiser la vérification de la cohérence entre la configuration Payload (payload.config.ts) et les fichiers de types (payload-types.ts). La meilleure pratique ne consiste pas seulement à générer les types, mais à vérifier qu'il n'y a pas de différence (drift) entre les types générés en CI et ceux présents dans le commit.  
**Action Indispensable : Génération et Comparaison de Types**  
Le workflow doit exécuter le script de génération de types de Payload et échouer si le fichier résultant diffère de celui versionné. Cela force le développeur (ou l'agent IA) à inclure la mise à jour des types dans son commit.

```yaml
- name: Generate Payload Types
  run: npx payload generate:types
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET_BUILD_Placeholder }}

- name: Verify Types Synchronization
  # Vérifie si le fichier généré modifie l'état git (ce qui signifierait que les types committés étaient obsolètes)
  run: |
    if [[ -n $(git status --porcelain src/payload-types.ts) ]]; then  
      echo "❌ Erreur : Les types Payload (src/payload-types.ts) ne sont pas synchronisés avec la config."  
      echo "👉 Exécutez 'npx payload generate:types' localement et committez le résultat."  
      exit 1  
    fi
```

### **4.3 Validation Runtime avec Zod**

## Bien que TypeScript gère la sécurité à la compilation, l'IA oublie souvent de gérer les cas d'erreur au runtime (par exemple, une API externe qui change de format). L'intégration de **Zod** pour valider les données entrant et sortant des Server Actions Next.js est cruciale.18 Le rapport recommande d'utiliser des linters qui forcent l'usage de la validation de schéma, bien que cela relève plus de la configuration ESLint que d'une Action GitHub spécifique.

## **5. Hygiène du Code et Optimisation : Le Nettoyage Automatisé avec Knip**

L'IA générative a une propension naturelle à la prolixité. Elle génère souvent des fichiers "orphelins", importe des bibliothèques lourdes pour n'utiliser qu'une seule fonction utilitaire, ou déclare des exports qui ne sont jamais consommés par le reste de l'application. Dans un projet combinant ShadCN (beaucoup de petits fichiers composants) et Next.js, cette accumulation de "code mort" (dead code) alourdit le bundle, ralentit le build et augmente la surface d'attaque.

### **5.1 Knip : Le "Garbage Collector" du Code IA**

Les outils classiques comme depcheck sont souvent insuffisants pour les monorepos modernes ou les structures Next.js complexes.21 **Knip** s'impose comme l'outil de référence pour cette tâche. Il analyse l'arbre syntaxique abstrait (AST) du projet pour comprendre précisément quels fichiers, dépendances et exports sont réellement utilisés.
Contrairement à un simple linter, Knip comprend les spécificités de Next.js (fichiers page.tsx, layout.tsx qui ne sont importés nulle part mais utilisés par le routeur) et de GitHub Actions, évitant ainsi les faux positifs courants.  
**Action Indispensable : Analyse de Code Mort**  
L'intégration de Knip dans le pipeline CI permet de rejeter tout code inutilement ajouté par l'IA.

```yaml
- name: Detect Unused Code & Exports (Knip)
  run: npx knip --no-exit-code --reporter json
  # L'option --no-exit-code peut être retirée pour rendre l'étape bloquante (recommandé)
```

## _Insight Stratégique :_ En forçant le nettoyage du code inutilisé, vous réduisez la charge cognitive pour les développeurs humains qui doivent relire le code de l'IA. Un code moins volumineux est un code plus facile à auditer et à sécuriser.

## **6. Intégrité de l'Interface Utilisateur : ShadCN et TailwindCSS**

L'utilisation de **ShadCN** et **TailwindCSS** présente des défis uniques en matière de qualité de code assisté par IA. ShadCN fonctionne sur un modèle de "copie" : le code des composants (Boutons, Dialogues) vit dans votre dépôt. L'IA peut modifier accidentellement ces composants de base, introduisant des régressions visuelles subtiles qui se propagent partout. De plus, la nature utilitaire de Tailwind conduit souvent à des chaînes de classes chaotiques générées par l'IA (ex: p-4 flex bg-red-500 vs flex bg-red-500 p-4), créant des conflits de fusion inutiles.

### **6.1 Standardisation Stylistique : Prettier et ESLint**

Pour maintenir une base de code saine, il est impératif d'imposer un ordre déterministe des classes Tailwind. Cela assure que deux générations d'IA produisant le même résultat visuel produiront également le même code binaire.  
**Actions Indispensables :**

1. **Prettier avec prettier-plugin-tailwindcss** : Ce plugin trie automatiquement les classes selon l'ordre recommandé par Tailwind.25 L'action CI doit vérifier que ce tri a été appliqué.
2. **eslint-plugin-tailwindcss** : Détecte les conflits logiques (ex: p-4 p-8 sur le même élément) et les classes inexistantes (hallucinations).

```
  - name: Check Tailwind Class Ordering
    run: npx prettier --check "**/*.{js,jsx,ts,tsx}"

  - name: Lint Tailwind Validity
    run: npx eslint. --ext.js,.jsx,.ts,.tsx
```

### **6.2 Gestion de la "Dérive" ShadCN (Component Drift)**

Puisque les composants ShadCN vous appartiennent, comment savoir si l'IA a modifié un composant de manière risquée ou si une mise à jour de sécurité est disponible en amont? Le CLI ShadCN a introduit une commande diff expérimentale.
Stratégie Avancée :  
Il est recommandé d'inclure une étape informative dans la CI qui compare les composants installés avec leur version originale. Cela n'a pas besoin de bloquer le build, mais doit alerter les mainteneurs.

```yaml
- name: Check ShadCN Component Drift
  run: npx shadcn diff
  continue-on-error: true
```

### **6.3 Tests de Régression Visuelle (VRT)**

Les tests unitaires ne voient pas si un bouton est devenu invisible à cause d'une classe z-index incorrecte générée par l'IA. Les tests de régression visuelle sont donc obligatoires. **Playwright** est l'outil le plus robuste pour cet usage, car il permet de générer des "snapshots" (captures d'écran) de référence et de les comparer à chaque commit.
Cependant, un piège majeur existe : le rendu des polices et des pixels diffère entre macOS (souvent utilisé par les devs) et Linux (utilisé par GitHub Actions).
Solution Indispensable : Conteneurisation des Tests Visuels  
Pour éviter les faux positifs constants, les tests visuels doivent être exécutés dans un conteneur Docker, tant localement que sur la CI, pour garantir un environnement de rendu identique au pixel près.  
**Action Playwright Recommandée :**

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Visual Regression Tests
  run: npx playwright test --project=visual
  env:
    CI: true

- name: Upload Visual Diff Report
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-visual-report
    path: playwright-report/
    retention-days: 30
```

## L'alternative **Lost Pixel** 32 est également viable et parfois plus simple à configurer pour les projets Next.js, offrant une intégration "SaaS" gratuite pour l'Open Source qui gère ces différences d'OS.

## **7. Accessibilité et Inclusivité Automatisées**

L'IA génère souvent du code sémantiquement pauvre (ex: des div cliquables au lieu de button, absence de aria-label). Pour un blog, l'accessibilité est non-négociable pour le SEO et l'expérience utilisateur.  
L'Outil Indispensable : axe-core via Playwright  
L'intégration de la bibliothèque axe-core directement dans les tests Playwright permet d'auditer l'accessibilité du DOM réel après hydratation React.34 Contrairement à des outils statiques, cela permet de vérifier l'accessibilité des composants interactifs complexes de ShadCN (modales, dropdowns).

```typescript
// Exemple de test Playwright indispensable
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Check accessibility on Blog Post page', async ({ page }) \=\> {
  await page.goto('/posts/mon-article');
  const accessibilityScanResults \= await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual();
});
```

## Cette vérification doit être bloquante dans le pipeline CI.

## **8. Synthèse et Orchestration du Workflow Idéal**

Pour orchestrer ces différentes couches de protection sans ralentir excessivement le cycle de développement, il est recommandé d'utiliser une architecture de workflow GitHub Actions parallèle.  
Le fichier .github/workflows/quality-gate.yml devrait structurer les jobs comme suit :

1. **Job setup** : Installe les dépendances et met en cache node_modules et .next/cache.
2. **Job compliance** (Parallèle) : Exécute Knip, Socket.dev, et le Linting (Prettier/ESLint). Ces tâches sont rapides et ne nécessitent pas de build.
3. **Job build-verify** (Parallèle) : Exécute payload generate:types puis next build \--experimental-build-mode compile.
4. **Job visual-a11y** (Dépend de build-verify) : Démarre l'application (start) et lance les tests Playwright (Visuel \+ Axe).

### **Tableau Récapitulatif des Actions GitHub Indispensables**

| Domaine           | Problème IA Ciblé                    | Action/Outil Indispensable                      | Réf. |
| :---------------- | :----------------------------------- | :---------------------------------------------- | :--- |
| **Sécurité**      | Paquets malveillants & Typosquatting | socket-dev/action                               | 12   |
| **Build**         | Connexion DB impossible en CI        | next build \--experimental-build-mode compile   | 5    |
| **Types**         | Incohérence CMS/Frontend             | payload generate:types \+ vérification git diff | 17   |
| **Hygiène**       | Code mort & Hallucinations           | knip                                            | 23   |
| **Style**         | Classes CSS non-déterministes        | prettier-plugin-tailwindcss                     | 25   |
| **Visuel**        | Régressions UI ShadCN                | playwright (avec Docker) ou lost-pixel          | 32   |
| **Accessibilité** | Sémantique HTML pauvre               | @axe-core/playwright                            | 35   |

En implémentant cette matrice d'actions, vous construisez un environnement où l'IA peut accélérer la production de code, tandis que GitHub Actions assure rigoureusement que ce code respecte les standards de qualité, de sécurité et de stabilité attendus d'une application professionnelle moderne.

#### **Sources des citations**

1. Payload 3.0: The first CMS that installs directly into any Next.js app, consulté le novembre 26, 2025, [https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)
2. GitHub \- payloadcms/payload-3.0-demo, consulté le novembre 26, 2025, [https://github.com/payloadcms/payload-3.0-demo](https://github.com/payloadcms/payload-3.0-demo)
3. Payload is the open-source, fullstack Next.js framework, giving you instant backend superpowers. Get a full TypeScript backend and admin panel instantly. Use Payload as a headless CMS or for building powerful applications. \- GitHub, consulté le novembre 26, 2025, [https://github.com/payloadcms/payload](https://github.com/payloadcms/payload)
4. Deploying Payload CMS 3.x with Docker Compose \+ GitHub Actions (The Issues Nobody Tells You About : r/nextjs \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/nextjs/comments/1o4a0fv/deploying_payload_cms_3x_with_docker_compose/](https://www.reddit.com/r/nextjs/comments/1o4a0fv/deploying_payload_cms_3x_with_docker_compose/)
5. Building without a DB connection | Documentation \- Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/docs/production/building-without-a-db-connection](https://payloadcms.com/docs/production/building-without-a-db-connection)
6. Building a project without a database connection · payloadcms payload · Discussion \#9028 \- GitHub, consulté le novembre 26, 2025, [https://github.com/payloadcms/payload/discussions/9028](https://github.com/payloadcms/payload/discussions/9028)
7. How do I build a Payload app without a database connection? : r/PayloadCMS \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/PayloadCMS/comments/1hpw5ro/how_do_i_build_a_payload_app_without_a_database/](https://www.reddit.com/r/PayloadCMS/comments/1hpw5ro/how_do_i_build_a_payload_app_without_a_database/)
8. NPM Security \- OWASP Cheat Sheet Series, consulté le novembre 26, 2025, [https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)
9. The Rise of Slopsquatting: How AI Hallucinations Are Fueling a New Class of Supply Chain Attacks \- Socket.dev, consulté le novembre 26, 2025, [https://socket.dev/blog/slopsquatting-how-ai-hallucinations-are-fueling-a-new-class-of-supply-chain-attacks](https://socket.dev/blog/slopsquatting-how-ai-hallucinations-are-fueling-a-new-class-of-supply-chain-attacks)
10. Shai-Hulud 2 Malware Campaign Targets GitHub and Cloud Credentials Using Bun Runtime | Blog | Endor Labs, consulté le novembre 26, 2025, [https://www.endorlabs.com/learn/shai-hulud-2-malware-campaign-targets-github-and-cloud-credentials-using-bun-runtime](https://www.endorlabs.com/learn/shai-hulud-2-malware-campaign-targets-github-and-cloud-credentials-using-bun-runtime)
11. Malicious NPM Package Found Targeting GitHub Actions \- Veracode, consulté le novembre 26, 2025, [https://www.veracode.com/blog/malicious-npm-package-targeting-github-actions/](https://www.veracode.com/blog/malicious-npm-package-targeting-github-actions/)
12. Introducing GitHub Actions Scanning Support \- Socket.dev, consulté le novembre 26, 2025, [https://socket.dev/blog/introducing-github-actions-scanning-support](https://socket.dev/blog/introducing-github-actions-scanning-support)
13. GitHub Marketplace \- Socket Security, consulté le novembre 26, 2025, [https://github.com/marketplace/socket-security](https://github.com/marketplace/socket-security)
14. Lint an npm or yarn lockfile to analyze and detect security issues \- GitHub, consulté le novembre 26, 2025, [https://github.com/lirantal/lockfile-lint](https://github.com/lirantal/lockfile-lint)
15. Collection of npm package manager Security Best Practices \- GitHub, consulté le novembre 26, 2025, [https://github.com/lirantal/npm-security-best-practices](https://github.com/lirantal/npm-security-best-practices)
16. General Testing Best Practices · payloadcms payload · Discussion \#2644 \- GitHub, consulté le novembre 26, 2025, [https://github.com/payloadcms/payload/discussions/2644](https://github.com/payloadcms/payload/discussions/2644)
17. Generating TypeScript Interfaces | Documentation \- Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/docs/typescript/generating-types](https://payloadcms.com/docs/typescript/generating-types)
18. Master the 2025 Stack: Complete Guide to Next.js 15, React 19, Tailwind v4 & Shadcn/ui : r/nextjs \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/nextjs/comments/1jt9i3m/master_the_2025_stack_complete_guide_to_nextjs_15/](https://www.reddit.com/r/nextjs/comments/1jt9i3m/master_the_2025_stack_complete_guide_to_nextjs_15/)
19. Using Knip in CI, consulté le novembre 26, 2025, [https://knip.dev/guides/using-knip-in-ci](https://knip.dev/guides/using-knip-in-ci)
20. Unused functions are not being detected · Issue \#643 · webpro-nl/knip \- GitHub, consulté le novembre 26, 2025, [https://github.com/webpro-nl/knip/issues/643](https://github.com/webpro-nl/knip/issues/643)
21. depcheck/depcheck: Check your npm module for unused dependencies \- GitHub, consulté le novembre 26, 2025, [https://github.com/depcheck/depcheck](https://github.com/depcheck/depcheck)
22. Some of the dependencies here are unused, how do I remove them without secretly breaking the project in some unexpected way? : r/node \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/node/comments/xfetbj/some_of_the_dependencies_here_are_unused_how_do_i/](https://www.reddit.com/r/node/comments/xfetbj/some_of_the_dependencies_here_are_unused_how_do_i/)
23. webpro-nl/knip: ✂️ Find unused files, dependencies and exports in your JavaScript and TypeScript projects. Knip it before you ship it\! \- GitHub, consulté le novembre 26, 2025, [https://github.com/webpro-nl/knip](https://github.com/webpro-nl/knip)
24. Knip: Declutter your JavaScript & TypeScript projects, consulté le novembre 26, 2025, [https://knip.dev/](https://knip.dev/)
25. A Prettier plugin for Tailwind CSS that automatically sorts classes based on our recommended class order. \- GitHub, consulté le novembre 26, 2025, [https://github.com/tailwindlabs/prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
26. francoismassart/eslint-plugin-tailwindcss: ESLint plugin for Tailwind CSS usage \- GitHub, consulté le novembre 26, 2025, [https://github.com/francoismassart/eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)
27. init \- Shadcn UI, consulté le novembre 26, 2025, [https://ui.shadcn.com/docs/cli](https://ui.shadcn.com/docs/cli)
28. \[bug\]: shadcn cli \- diff command not working · Issue \#5427 \- GitHub, consulté le novembre 26, 2025, [https://github.com/shadcn-ui/ui/issues/5427](https://github.com/shadcn-ui/ui/issues/5427)
29. Automate Playwright Tests in Next.js 14 Using GitHub Actions, consulté le novembre 26, 2025, [https://sergeipetrukhin.vercel.app/github-actions](https://sergeipetrukhin.vercel.app/github-actions)
30. Are there any fully open-source tools with smart visual regression like Turbosnap? \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/softwaretesting/comments/1lgu5ev/are_there_any_fully_opensource_tools_with_smart/](https://www.reddit.com/r/softwaretesting/comments/1lgu5ev/are_there_any_fully_opensource_tools_with_smart/)
31. Streamlining Playwright Visual Regression Testing with GitHub Actions | by Haley Ward, consulté le novembre 26, 2025, [https://medium.com/@haleywardo/streamlining-playwright-visual-regression-testing-with-github-actions-e077fd33c27c](https://medium.com/@haleywardo/streamlining-playwright-visual-regression-testing-with-github-actions-e077fd33c27c)
32. lost-pixel/lost-pixel: Open source alternative to Percy, Chromatic, Applitools. \- GitHub, consulté le novembre 26, 2025, [https://github.com/lost-pixel/lost-pixel](https://github.com/lost-pixel/lost-pixel)
33. Lost Pixel · Actions · GitHub Marketplace, consulté le novembre 26, 2025, [https://github.com/marketplace/actions/lost-pixel](https://github.com/marketplace/actions/lost-pixel)
34. dequelabs/axe-core: Accessibility engine for automated Web UI testing \- GitHub, consulté le novembre 26, 2025, [https://github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)
35. Accessibility audits with Playwright, Axe, and GitHub Actions \- DEV Community, consulté le novembre 26, 2025, [https://dev.to/jacobandrewsky/accessibility-audits-with-playwright-axe-and-github-actions-2504](https://dev.to/jacobandrewsky/accessibility-audits-with-playwright-axe-and-github-actions-2504)
36. From Theory to Automation: WCAG compliance using axe-core, next.js, and GitHub actions, consulté le novembre 26, 2025, [https://medium.com/@SkorekM/from-theory-to-automation-wcag-compliance-using-axe-core-next-js-and-github-actions-b9f63af8e155](https://medium.com/@SkorekM/from-theory-to-automation-wcag-compliance-using-axe-core-next-js-and-github-actions-b9f63af8e155)
