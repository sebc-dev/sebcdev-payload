# **Configuration Avancée et Optimisation de Lighthouse CI pour les Architectures Next.js et Cloudflare**

## **1. Fondements et Philosophie de l'Audit de Performance Automatisé**

Dans l'écosystème actuel du développement web, la performance ne constitue plus simplement une métrique technique isolée, mais un impératif architectural déterminant pour l'expérience utilisateur et le référencement (SEO). Pour des projets modernes exploitant des piles technologiques complexes comme Next.js 15, Cloudflare Workers et Payload CMS, l'approche traditionnelle consistant à effectuer des audits manuels en fin de cycle de développement est devenue obsolète et risquée. L'analyse approfondie des pratiques actuelles démontre une transition nécessaire vers le "Shift-Left Performance Testing", une philosophie qui intègre la validation des performances au plus tôt dans le cycle de vie du code.1 L'outil Lighthouse CI (LHCI) s'impose comme le standard industriel pour cette automatisation, offrant un mécanisme robuste pour détecter les régressions des Core Web Vitals (CWV), de l'accessibilité et du SEO avant même qu'elles n'atteignent l'environnement de production.
L'intégration de Lighthouse CI dans les GitHub Actions pour un projet régi par un Document des Exigences Produit (PRD) strict nécessite de dépasser les configurations par défaut. Elle exige une compréhension nuancée de la variabilité des environnements d'Intégration Continue (CI), des mécanismes d'authentification pour les routes protégées telles que les panneaux d'administration de CMS, et de la synchronisation précise avec des environnements de déploiement dynamiques comme les Preview URLs de Cloudflare.4 Ce rapport fournit une analyse technique exhaustive pour configurer @lhci/cli de manière optimale, en abordant les contraintes architecturales spécifiques de Next.js et Cloudflare tout en atténuant l'instabilité inhérente aux tests de performance dans des environnements de calcul partagés.

### **1.1 La Nécessité du Monitoring Continu (Shift-Left)**

L'approche "Shift-Left" en matière de performance web repose sur le principe que le coût de la correction d'une régression de performance augmente de manière exponentielle à mesure que le code progresse vers la production. Les outils traditionnels, souvent basés sur des services SaaS exécutant des tests périodiques sur la production, ne fournissent qu'un feedback réactif.1 À l'inverse, Lighthouse CI permet d'établir des "Budgets de Performance" stricts. Ces budgets agissent comme des barrières de qualité (Quality Gates), empêchant physiquement la fusion de code (Merge) si celui-ci dégrade des métriques critiques comme le Largest Contentful Paint (LCP) ou le Cumulative Layout Shift (CLS).6  
L'automatisation via GitHub Actions transforme la performance d'une préoccupation ponctuelle en une responsabilité continue et partagée par toute l'équipe d'ingénierie. Chaque Pull Request devient un point de contrôle où l'impact de chaque modification — qu'il s'agisse de l'ajout d'une bibliothèque JavaScript lourde ou d'une image non optimisée — est quantifié et jugé par rapport aux seuils définis dans le PRD.

### **1.2 Anatomie de Lighthouse CI**

Lighthouse CI n'est pas un outil monolithique mais une suite de composants orchestrés pour capturer, analyser et stocker des données de performance. Comprendre cette architecture est crucial pour une configuration experte.

- **Le Collecteur (Collect):** C'est le moteur qui pilote le navigateur (Chrome/Chromium) pour charger les pages et exécuter les audits Lighthouse. Il peut fonctionner en mode statique (servant des fichiers HTML) ou dynamique (lançant un serveur local ou auditant une URL distante).
- **L'Assertions (Assert):** Ce module compare les résultats obtenus par le collecteur aux seuils définis dans la configuration. C'est ici que la logique métier du PRD est traduite en règles techniques (e.g., "Le LCP ne doit pas dépasser 2500ms")
- **Le Serveur (Server/Upload):** Ce composant gère le stockage et la visualisation de l'historique des performances. Bien que l'option de stockage temporaire public soit disponible, une infrastructure d'entreprise nécessite souvent des solutions pérennes pour tracer l'évolution des métriques sur le long terme.

## **2. Configuration Stratégique du Manifeste lighthouserc.js**

Le fichier de configuration lighthouserc.json (ou .js) est le centre névralgique de Lighthouse CI. Pour une application complexe impliquant des routes authentifiées et des builds dynamiques, une configuration simpliste générera des résultats incohérents et "flaky" (instables). L'expert privilégiera systématiquement le format .js au format .json, car il permet l'injection dynamique de variables d'environnement et l'exécution de logique conditionnelle, indispensable pour gérer les secrets et les URLs d'environnement variables.

### **2.1 Structure Optimale et Flexibilité**

La configuration est encapsulée dans un objet ci contenant trois piliers principaux : collect, assert, et upload.2 La maîtrise de ces objets permet d'adapter l'outil aux contraintes spécifiques de l'infrastructure Cloudflare et du framework Next.js.  
**Tableau 1 : Propriétés de Configuration Critiques et Recommandations Expertes**

| Propriété            | Description Technique                        | Recommandation Stratégique                                  | Justification                                                                                                                                         |
| :------------------- | :------------------------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| numberOfRuns         | Nombre d'itérations d'audit par URL.         | Minimum **3**, idéalement **5** pour les environnements CI. | Les runners CI (GitHub Actions) ont des CPU partagés volatils. LHCI agrège ces courses en une médiane pour lisser la variance.                        |
| startServerCommand   | Commande pour démarrer l'application locale. | npm run start (après build) avec détection de port.         | Crucial pour tester le build de production localement si l'URL distante n'est pas prête. Éviter npm run dev qui ne reflète pas la performance réelle. |
| puppeteerScript      | Chemin vers le script d'automatisation.      | Obligatoire pour l'authentification Payload CMS.            | Permet de pénétrer les zones sécurisées (Admin Panel) en simulant une connexion utilisateur avant l'audit.10                                          |
| settings.chromeFlags | Drapeaux de lancement de Chrome.             | --no-sandbox --disable-gpu --disable-dev-shm-usage.         | Indispensable dans les environnements conteneurisés (Docker/GHA) pour éviter les crashs liés à la mémoire partagée ou au GPU inexistant.              |
| settings.preset      | Profil de l'appareil émulé.                  | desktop pour l'Admin, mobile (défaut) pour le site public.  | L'Admin Panel de Payload CMS est un outil desktop-first. L'auditer en mobile fausserait les scores d'accessibilité et de performance.                 |

### **2.2 La Stratégie de Collection Hybride**

Pour un projet Next.js hébergé sur Cloudflare, il existe deux vecteurs d'audit :

1. **Audit Local (Localhost) :** Rapide, ne nécessite pas de déploiement réseau, mais ne teste pas l'infrastructure Edge (CDN, cache Cloudflare).
2. **Audit Distant (Preview URL) :** Plus lent car nécessite un déploiement préalable, mais offre une fidélité totale ("High Fidelity") par rapport à l'expérience utilisateur réelle.

L'approche experte consiste à configurer le lighthouserc.js pour qu'il soit agnostique ou adaptatif. En utilisant des variables d'environnement, on peut diriger LHCI soit vers le localhost, soit vers l'URL de prévisualisation générée par wrangler.

```javascript
// lighthouserc.js - Configuration Expert
module.exports = {
  ci: {
    collect: {
      // Utilisation de l'URL injectée par le pipeline CI ou repli sur localhost
      url:,
      // Le script Puppeteer n'est exécuté que si nécessaire
      puppeteerScript: './scripts/auth-payload.js',
      numberOfRuns: 3,
      // Si on est en CI et qu'on a une URL distante, on ne lance pas de serveur local.
      // Sinon (test local), on lance le build de production.
      startServerCommand: process.env.PREVIEW_URL? undefined : 'npm run start',
      startServerReadyPattern: 'Ready on', // Pattern de log Next.js indiquant que le serveur écoute
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage',
        // Désactivation partielle du throttling CPU pour compenser la faiblesse des runners CI
        throttlingMethod: 'devtools',
      },
    },
    assert: {
      assertions: {
        'categories:performance':,
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

Cette configuration permet une flexibilité totale : le développeur peut tester en local (lhci autorun) avant de pousser, et le CI testera l'URL réelle déployée.

## **3. Intégration Avancée avec GitHub Actions et Cloudflare**

L'intersection des GitHub Actions (GHA) et des Cloudflare Workers présente un défi de synchronisation spécifique : la "Race Condition" de l'URL de prévisualisation. Lorsqu'un projet Cloudflare Pages ou Workers est déployé, il génère une URL unique. Lighthouse CI doit impérativement attendre la finalisation de ce déploiement et la disponibilité effective de l'URL avant de commencer l'audit, sous peine d'analyser une page d'erreur ou une version antérieure.

### **3.1 Le Problème de la Latence de Déploiement**

Dans un flux de travail standard, la commande wrangler deploy pousse le worker et rend la main. Cependant, la propagation DNS et l'activation du Worker sur le réseau Edge de Cloudflare ne sont pas instantanées. Si Lighthouse se lance immédiatement contre l'URL retournée, il risque de rencontrer des erreurs de connexion ou des timeouts.14 De plus, l'extraction de cette URL depuis les logs de wrangler a historiquement été complexe, bien que les versions récentes supportent une sortie JSON structurée.

### **3.2 Architecture du Workflow GitHub Actions**

Pour garantir la robustesse, le workflow GHA doit explicitement bloquer l'exécution jusqu'à ce que l'URL cible réponde avec un code HTTP 200.  
**Séquence recommandée des étapes du Workflow :**

1. **Checkout & Setup :** Récupération du code et installation de Node.js.
2. **Build Next.js :** Compilation de l'application (npm run build). C'est une pré-condition essentielle pour vérifier l'intégrité du code avant même de tenter le déploiement.
3. **Déploiement Cloudflare :** Exécution de wrangler deploy (ou pages deploy) avec capture de la sortie JSON.
4. **Extraction et Attente (Polling) :** Parsing du JSON pour obtenir la preview_url et utilisation d'un script d'attente (wait-on ou curl loop).
5. **Exécution de Lighthouse :** Lancement de lhci autorun en ciblant l'URL vérifiée.

### **3.3 Extraction de l'URL via wrangler et Sortie JSON**

La commande wrangler deploy (et versions upload) permet désormais une sortie JSON, ce qui facilite grandement l'automatisation.

```
# Snippet.github/workflows/ci.yml pour le déploiement
- name: Deploy to Cloudflare Workers
  id: deploy
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    # L'option command permet de spécifier des arguments supplémentaires
    command: pages deploy.out --branch=${{ github.head_ref }} --commit-dirty=true
  env:
    # Désactiver les métriques pour éviter de polluer la sortie standard
    WRANGLER_SEND_METRICS: false
```

Il est crucial de noter que le wrangler-action expose généralement une sortie deployment-url. Cependant, pour une régression stricte, les URLs de prévisualisation "versionnées" (basées sur le hash du commit) sont supérieures aux alias de branche génériques (branch-name.project.pages.dev), car elles sont immuables.

### **3.4 Le Pattern de Sécurité wait-for-url**

Pour Next.js 15, la vérification de la disponibilité du serveur (startServerReadyPattern) incluse dans LHCI fonctionne parfaitement pour les serveurs locaux.9 Pour les URLs distantes Cloudflare, une étape manuelle wait-on est indispensable.

```bash
# Commande bash pour attendre la disponibilité de l'URL
url="${{ steps.deploy.outputs.deployment-url }}"
echo "Attente de la disponibilité de $url..."
# Boucle avec timeout de 60 secondes
timeout 60s bash -c "until curl -s -f -o /dev/null $url; do sleep 2; done"
```

Cette commande met le pipeline en pause jusqu'à 60 secondes, en sondant l'URL toutes les 2 secondes. C'est un pattern de stabilité critique ; sans cela, Lighthouse s'exécute souvent contre une page "En cours de déploiement..." ou une connexion interrompue, générant des faux négatifs frustrants dans le statut CI.

## **4. Stratégies d'Authentification pour Payload CMS**

L'audit de la partie publique (frontend Next.js) est direct. Cependant, le PRD inclut probablement des exigences de performance pour le panneau d'administration de Payload CMS. Lighthouse, par conception, efface tout le stockage et les cookies entre chaque exécution, ce qui signifie qu'il visite les pages en tant qu'utilisateur anonyme. Pour auditer le tableau de bord administrateur, il est impératif d'injecter un état authentifié.

### **4.1 L'Approche par Script Puppeteer**

Lighthouse CI supporte nativement une configuration puppeteerScript. Ce script s'exécute _avant_ l'audit Lighthouse proprement dit, permettant à une instance de navigateur (headless) d'interagir avec le formulaire de connexion, de soumettre des identifiants et d'établir une session (via cookies ou LocalStorage) que Lighthouse héritera ensuite pour son analyse.

### **4.2 Anatomie d'un Script de Connexion Payload CMS**

Payload CMS utilise des sélecteurs spécifiques pour ses formulaires de connexion. Basé sur la documentation et les patterns de composants React standards dans Payload, le formulaire de connexion réside typiquement à l'URL /admin/login. Les champs d'entrée portent généralement les attributs name="email" et name="password", ou des IDs générés par le constructeur de formulaire interne.
**Détail d'Implémentation Critique :** Les formulaires Payload CMS sont pilotés par React. Puppeteer doit impérativement attendre l'hydratation du DOM avant de tenter de saisir du texte. Un script naïf qui tente de taper immédiatement après la navigation échouera systématiquement car les écouteurs d'événements React ne seront pas encore attachés.  
**Script auth-payload.js Optimisé :**

```javascript
/**
 * Script d'authentification pour Payload CMS via Puppeteer
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  // Lancement d'une nouvelle page pour le processus de login
  const page = await browser.newPage();

  // Dérivation de l'URL de base pour construire l'URL de login
  // context.url est l'URL que Lighthouse s'apprête à auditer
  const baseUrl = new URL(context.url).origin;
  const loginUrl = `${baseUrl}/admin/login`;

  // Navigation vers la page de login
  // networkidle0 assure que le chargement initial des ressources est terminé
  await page.goto(loginUrl, { waitUntil: 'networkidle0' });

  // Sélecteurs stables pour Payload CMS 3.x/2.x
  // L'utilisation des attributs 'name' est plus robuste que les classes CSS qui peuvent changer
  const emailSelector = 'input[name="email"]';
  const passwordSelector = 'input[name="password"]';
  const submitSelector = 'button[type="submit"]'; // Souvent le bouton contient "Login"

  // Attente explicite de l'apparition du formulaire (Check d'hydratation)
  try {
    await page.waitForSelector(emailSelector, { visible: true, timeout: 15000 });
  } catch (e) {
    throw new Error(`Le formulaire de login n'est pas apparu sur ${loginUrl}`);
  }

  // Injection des identifiants depuis les variables d'environnement
  // NE JAMAIS coder en dur les identifiants dans le script
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email ||!password) {
    throw new Error('Identifiants Admin non trouvés dans les variables d'environnement.');
  }

  // Interaction utilisateur
  await page.type(emailSelector, email, { delay: 10 }); // Petit délai pour simuler l'humain
  await page.type(passwordSelector, password, { delay: 10 });

  // Soumission et attente de la navigation
  // On attend que l'URL change ou que le tableau de bord apparaisse
  await Promise.all();

  // Vérification : Sommes-nous redirigés vers /admin (hors login)?
  if (page.url().includes('/login')) {
    throw new Error(`Échec du login. URL actuelle : ${page.url()} - Vérifiez les identifiants.`);
  }

  // Fermeture de la page. Les cookies de session persistent dans le contexte du navigateur
  // et seront utilisés par Lighthouse pour les audits suivants.
  await page.close();
};
```

### **4.3 Gestion des Mécanismes de Sécurité Payload**

Les fonctionnalités de sécurité de Payload, telles que la protection CSRF et les cookies HttpOnly, fonctionnent généralement sans heurts avec cette approche car Puppeteer opère au sein du même contexte de navigateur que Lighthouse utilisera. Cependant, si la "Local Strategy" est désactivée au profit de fournisseurs d'authentification tiers (comme OAuth via GitHub ou Google), le script devient significativement plus complexe, nécessitant l'interaction avec des formulaires de connexion externes.
_Insight d'Expert :_ Si Payload est configuré avec des politiques de cookies SameSite strictes, assurez-vous que l'exécution de Lighthouse (qui pourrait utiliser localhost) et le domaine du cookie correspondent. L'utilisation d'une URL de prévisualisation entièrement déployée pour la connexion et l'audit évite les incompatibilités de domaine de cookie souvent observées dans les configurations mixtes localhost/distant.

## **5. Spécificités de Next.js 15 : Hydratation et Modes de Build**

Next.js 15 introduit des changements architecturaux qui peuvent impacter directement les scores Lighthouse, en particulier autour des mécaniques d'hydratation de React 19 et des modes de build expérimentaux.

### **5.1 La Pénalité d'Erreur d'Hydratation**

Lighthouse mesure le "Total Blocking Time" (TBT) et le "Cumulative Layout Shift" (CLS). Si Next.js rencontre une discordance d'hydratation (fréquente avec le formatage de dates, les IDs aléatoires, ou les extensions de navigateur modifiant le DOM), React écartera le HTML rendu par le serveur et effectuera un nouveau rendu complet de l'arbre DOM côté client. Cela provoque un pic massif de TBT et un saut visuel (CLS) pénalisant lourdement le score.23  
Impact sur la Configuration CLI :  
Lighthouse CLI rapportera ces événements comme des échecs de performance majeurs. Il est crucial de comprendre que la correction des erreurs d'hydratation est un prérequis absolu à la configuration de Lighthouse CI. Aucun ajustement de configuration ne pourra compenser un score pénalisé par un double rendu.  
**Détection Automatisée :** Utilisez l'audit console-error ou errors-in-console dans Lighthouse pour faire échouer les builds si des erreurs d'hydratation apparaissent dans la console.

```javascript
assertions: {
  'errors-in-console':, // Tolérance zéro pour les erreurs console (dont hydratation)
}
```

### **5.2 Modes de Build Expérimentaux de Next.js**

Next.js 15 explore de nouveaux modes d'optimisation de build (experimental-build-mode). Lorsque ces modes sont utilisés, les artefacts générés peuvent différer en structure. Si vous utilisez staticDistDir dans LHCI (pour un site purement statique), assurez-vous que le répertoire de sortie correspond aux nouveaux artefacts de build. Cependant, pour les déploiements Cloudflare Workers/Pages, nous nous appuyons généralement sur le répertoire de sortie standard de wrangler (souvent adapté du dossier .next ou un dossier out spécifique si l'export statique est utilisé).25 La configuration LHCI doit être alignée avec le mode de sortie de Next.js (Standalone vs Export).

## **6. Stratégies Anti-Instabilité (Flakiness) et Fiabilité**

L'un des "pièges" les plus significatifs de Lighthouse CI est l'échec non déterministe. Un build qui échoue parce que le LCP était de 2,6s au lieu de 2,5s à cause d'un "voisin bruyant" (noisy neighbor) sur le serveur CI est frustrant et érode la confiance de l'équipe dans l'outil.

### **6.1 Assertions Statistiques : minScore vs maxNumericValue**

Bien qu'il soit tentant d'affirmer un minScore de 0,9 (90/100) pour la catégorie Performance, le score Lighthouse est non-linéaire et hautement volatil. Un changement de seulement 100ms dans le LCP peut faire chuter le score de plusieurs points lorsqu'on est proche des seuils critiques.  
**Recommandation Experte :** Affirmez vos exigences contre des métriques brutes utilisant maxNumericValue plutôt que le score abstrait. Les métriques comme le LCP (en millisecondes) et le CLS (sans unité) sont linéaires et beaucoup plus faciles à déboguer.

- **À éviter :** categories:performance: (Trop fragile pour la CI).
- **À privilégier :** largest-contentful-paint: ['error', { maxNumericValue: 3000 }] (SLA clair et mesurable).

### **6.2 La Stratégie "Warn" vs "Error"**

Pour éviter de bloquer les déploiements à cause de fluctuations mineures, utilisez une stratégie d'assertion à plusieurs niveaux :

- **Error (Bloquant) :** Définissez des limites larges qui représentent des dégradations inacceptables (par exemple, LCP > 4s).
- **Warn (Non-bloquant) :** Définissez des limites strictes qui représentent l'état cible idéal (par exemple, LCP > 2.5s).

Cela garantit que seules les régressions catastrophiques cassent le build, tandis que les dérives de performance sont signalées comme des avertissements dans les commentaires de la PR, incitant à l'optimisation sans paralyser l'équipe.

## **7. Optimisation pour les Runners GitHub Actions**

Les runners GitHub Actions (Linux standard) ont une performance CPU variable. Cela crée de la "flakiness" où les scores sautent entre les exécutions sans lien avec les changements de code.

### **7.1 Ajustement du Throttling**

Lighthouse simule un appareil mobile en bridant (throttling) le CPU. Sur un runner CI déjà faible, ce bridage se compose, rendant le site artificiellement lent.  
**Stratégie d'Optimisation :**

1. **Désactiver le Throttling CPU (Partiellement) :** Configurer throttlingMethod: 'devtools' ou ajuster le multiplicateur de throttling peut fournir des scores plus stables (relatifs), même s'ils ne correspondent pas parfaitement à des appareils mobiles réels en conditions difficiles. Cela permet de comparer des pommes avec des pommes d'un commit à l'autre.10
2. **Runs de "Chauffage" (Warmup) :** La première exécution subit souvent des surcoûts de résolution DNS et de connexion SSL. Bien que LHCI effectue 3 exécutions par défaut et prenne la médiane, s'assurer que le serveur est "chaud" (par exemple, en le frappant avec curl une fois avant l'audit) peut stabiliser les caches ISR (Incremental Static Regeneration) de Next.js.

## **8. Implémentation Avancée du Workflow GitHub Actions**

Le workflow suivant synthétise la recherche en un pipeline prêt pour la production. Il gère l'authentification, le déploiement Cloudflare, l'attente active de l'URL, et l'exécution de LHCI.

### **8.1 Secrets et Permissions**

Le workflow nécessite un LHCI_GITHUB_APP_TOKEN pour publier les vérifications d'état (Status Checks) directement sur le commit. C'est supérieur à un commentaire de bot générique car cela s'intègre à l'API GitHub Checks, permettant aux règles de protection de branche "Required Checks" de bloquer les merges si Lighthouse échoue.

### **8.2 Code du Workflow (.github/workflows/lighthouse.yml)**

```yaml
name: Performance Audit (Lighthouse CI)

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Next.js Project
        run: npm run build

      - name: Deploy to Cloudflare Pages (Preview)
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          # Déploiement vers Cloudflare Pages avec commit dirty autorisé
          command: pages deploy.out --branch=${{ github.head_ref }} --commit-dirty=true
        env:
          # S'assurer qu'aucune télémétrie ou invite interactive ne bloque la CI
          WRANGLER_SEND_METRICS: false

      - name: Wait for Preview URL
        # L'action Wrangler sort 'deployment-url'. Nous la sondons pour assurer le 200 OK.
        run: |
          url="${{ steps.deploy.outputs.deployment-url }}"  
          echo "Attente de disponibilité pour $url..."  
          timeout 60s bash -c "until curl -s -f -o /dev/null $url; do sleep 2; done"

      - name: Run Lighthouse CI
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          # Passage de l'URL de prévisualisation à la config via variable d'environnement
          PREVIEW_URL: ${{ steps.deploy.outputs.deployment-url }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
        run: |
          npm install -g @lhci/cli  
          lhci autorun
```

### **8.3 Configuration du Token GitHub App**

Pour activer les vérifications d'état améliorées (où les résultats Lighthouse apparaissent comme des vérifications granulaires telles que "Lighthouse / performance" plutôt qu'un échec CI générique) :

1. Installer l'application **Lighthouse CI GitHub App** sur le dépôt.
2. Copier le token fourni lors de l'installation.
3. Le stocker sous le nom LHCI_GITHUB_APP_TOKEN dans les secrets du dépôt GitHub.3

Cette configuration permet à la CLI LHCI de communiquer en retour avec GitHub, annotant des lignes de code spécifiques ou créant des résumés riches dans l'onglet "Checks".

## **9. Analyse Avancée et Reporting : Éviter la Perte d'Historique**

Lighthouse CI peut télécharger les rapports vers un serveur privé pour créer des graphiques historiques. Si vous utilisez temporary-public-storage (le niveau gratuit de Google), les rapports disparaissent après 7 jours. Pour un projet PRD, les données historiques sont vitales pour prouver la non-régression sur plusieurs mois.  
**Tableau 2 : Comparaison des Cibles de Stockage (Upload Targets)**

| Cible                    | Avantages                                                              | Inconvénients                                                                                   | Cas d'Usage Idéal                             |
| :----------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| temporary-public-storage | Zéro configuration, gratuit, URLs publiques immédiates.                | Données supprimées après 7 jours, accès public (risque de sécurité pour les dashboards privés). | Configuration initiale, projets Open Source.2 |
| filesystem               | Contrôle total, sauvegarde possible via GitHub Artifacts.              | Pas de graphique d'historique, nécessite un téléchargement manuel pour visualiser.              | Projets internes critiques niveau sécurité.10 |
| lhci (Server)            | Tendances historiques, comparaison de diffs (Diffing), stockage privé. | Nécessite l'hébergement d'un serveur/conteneur séparé.                                          | PRD d'entreprise, maintenance à long terme.1  |

**Recommandation :** Si le budget le permet, déployez un serveur LHCI auto-hébergé (conteneur Docker) ou utilisez un adaptateur SaaS dédié. Cela permet de "differ" les changements dans le temps, montrant exactement quel commit a causé une régression de 100ms dans le TBT.

## **10. Pièges Courants et "Insights" Nuancés**

### **10.1 Le Piège "Mobile" vs "Desktop" en CI**

Lighthouse par défaut émule un mobile. Cependant, les runners CI typiques ont une performance simple-cœur plus lente qu'un smartphone milieu de gamme moderne. Lorsque Lighthouse applique son bridage CPU (4x) par-dessus un CPU virtuel déjà lent, les scores peuvent s'effondrer artificiellement.

- _Mitigation :_ Si vous optimisez pour le mobile, comprenez que les scores CI seront inférieurs aux tests locaux. Établissez une "Baseline CI" plutôt que d'attendre une parité avec un MacBook M1/M2/M3 local.1

### **10.2 Contenu Dynamique et Payload CMS**

Puisque Payload CMS est "headless", le frontend récupère le contenu via API. Si le déploiement de prévisualisation Cloudflare n'a pas accès à la base de données de production (ou une base de staging peuplée), les pages peuvent rendre des états vides ou d'erreur (404).

- _Exigence :_ Les variables d'environnement du Cloudflare Worker dans le contexte CI (ou wrangler.toml) doivent pointer vers une instance de base de données valide et accessible. Lighthouse auditant une page "Database Connection Error" est un mode d'échec de configuration fréquent.

## **11. Conclusion**

Configurer Lighthouse CI de manière optimale pour ce PRD implique d'orchestrer une danse complexe entre l'infrastructure (Cloudflare), le framework (Next.js) et l'authentification (Payload). En dépassant l'installation standard pour adopter des scripts Puppeteer personnalisés, une synchronisation rigoureuse des URLs de prévisualisation, et des assertions basées sur des métriques brutes, vous transformez un simple outil de rapport en un gardien infatigable de la qualité logicielle.  
**Points Clés pour l'Expertise :**

1. **L'Authentification est Scriptable :** Utilisez Puppeteer pour pénétrer l'admin Payload, mais gérez le délai d'hydratation React avec précaution.
2. **La Synchronisation est Critique :** Ne jamais supposer que deploy signifie "prêt". Implémentez toujours une boucle d'attente pour les URLs de prévisualisation Cloudflare.
3. **Métriques > Scores :** Affirmez sur des valeurs millisecondes spécifiques (maxNumericValue) plutôt que des scores abstraits pour réduire l'instabilité CI.
4. **Conscience de l'Environnement :** Ajustez les paramètres de throttling pour tenir compte des limitations physiques des runners GitHub Actions.

En implémentant le lighthouserc.js détaillé et le workflow GitHub Actions fournis ci-dessus, le projet bénéficiera d'un filet de sécurité de performance robuste et automatisé, capable de passer à l'échelle et de garantir le respect continu des hauts standards du PRD.

### **Tableau Récapitulatif des Seuils d'Assertion Recommandés**

**Tableau 3 : Seuils d'Assertion Recommandés pour Next.js 15 sur Cloudflare**

| Métrique                     | ID                       | Seuil Avertissement (Soft Fail) | Seuil Erreur (Hard Fail) | Raisonnement Expert                                                                                |
| :--------------------------- | :----------------------- | :------------------------------ | :----------------------- | :------------------------------------------------------------------------------------------------- |
| **First Contentful Paint**   | first-contentful-paint   | > 1800 ms                       | > 3000 ms                | La latence réseau CI gonfle souvent le FCP.                                                        |
| **Largest Contentful Paint** | largest-contentful-paint | > 2500 ms                       | > 4000 ms                | Le LCP est sensible à l'optimisation d'image (Cloudflare Images) et au temps de réponse serveur.   |
| **Cumulative Layout Shift**  | cumulative-layout-shift  | > 0.1                           | > 0.25                   | Application stricte requise ; le CLS devrait être proche de zéro pour les pages statiques Next.js. |
| **Total Blocking Time**      | total-blocking-time      | > 200 ms                        | > 600 ms                 | Un TBT élevé indique souvent des problèmes d'hydratation dans Next.js 15.                          |

#### **Sources des citations**

1. Continuously optimize your website with Lighthouse CI - Thoughtworks, consulté le novembre 27, 2025, [https://www.thoughtworks.com/en-us/insights/blog/continuous-delivery/continuously-optimize-lighthouse](https://www.thoughtworks.com/en-us/insights/blog/continuous-delivery/continuously-optimize-lighthouse)
2. Optimizing Web Performance with Lighthouse CI: Best Practices - NashTech Blog, consulté le novembre 27, 2025, [https://blog.nashtechglobal.com/optimizing-web-performance-with-lighthouse-ci-best-practices/](https://blog.nashtechglobal.com/optimizing-web-performance-with-lighthouse-ci-best-practices/)
3. Monitoring Performance with Lighthouse CI in GitHub Actions - Software House, consulté le novembre 27, 2025, [https://softwarehouse.au/blog/monitoring-performance-with-lighthouse-ci-in-github-actions/](https://softwarehouse.au/blog/monitoring-performance-with-lighthouse-ci-in-github-actions/)
4. GitHub Actions · Cloudflare Workers docs, consulté le novembre 27, 2025, [https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
5. Preview deployments · Cloudflare Pages docs, consulté le novembre 27, 2025, [https://developers.cloudflare.com/pages/configuration/preview-deployments/](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
6. Lighthouse CI: Catch Performance Regressions Before They Ship, consulté le novembre 27, 2025, [https://www.trevorlasn.com/blog/lighthouse-ci](https://www.trevorlasn.com/blog/lighthouse-ci)
7. Performance monitoring with Lighthouse CI | Articles - web.dev, consulté le novembre 27, 2025, [https://web.dev/articles/lighthouse-ci](https://web.dev/articles/lighthouse-ci)
8. Troubleshooting Common Issues with Lighthouse CI - NashTech Blog, consulté le novembre 27, 2025, [https://blog.nashtechglobal.com/troubleshooting-common-issues-with-lighthouse-ci/](https://blog.nashtechglobal.com/troubleshooting-common-issues-with-lighthouse-ci/)
9. Continuous Performance Analysis with Lighthouse CI and GitHub Actions - CSS-Tricks, consulté le novembre 27, 2025, [https://css-tricks.com/continuous-performance-analysis-with-lighthouse-ci-and-github-actions/](https://css-tricks.com/continuous-performance-analysis-with-lighthouse-ci-and-github-actions/)
10. Configuration | lighthouse-ci - GitHub Pages, consulté le novembre 27, 2025, [https://googlechrome.github.io/lighthouse-ci/docs/configuration.html](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html)
11. Automating Google Lighthouse audits and uploading results to Azure | Keeping Up To Date, consulté le novembre 27, 2025, [https://keepinguptodate.com/pages/2021/07/automating-google-lighthouse-upload-to-azure/](https://keepinguptodate.com/pages/2021/07/automating-google-lighthouse-upload-to-azure/)
12. Lighthouse CI Action - GitHub Marketplace, consulté le novembre 27, 2025, [https://github.com/marketplace/actions/lighthouse-ci-action](https://github.com/marketplace/actions/lighthouse-ci-action)
13. Running Lighthouse CI in a Lightweight Docker Container | by Pradap Pandiyan - Medium, consulté le novembre 27, 2025, [https://pradappandiyan.medium.com/running-lighthouse-ci-in-a-lightweight-docker-container-d3559b362d5d](https://pradappandiyan.medium.com/running-lighthouse-ci-in-a-lightweight-docker-container-d3559b362d5d)
14. Preview URLs · Cloudflare Workers docs, consulté le novembre 27, 2025, [https://developers.cloudflare.com/workers/configuration/previews/](https://developers.cloudflare.com/workers/configuration/previews/)
15. Deploy to Cloudflare Workers with Wrangler and get publish URL - GitHub Marketplace, consulté le novembre 27, 2025, [https://github.com/marketplace/actions/deploy-to-cloudflare-workers-with-wrangler-and-get-publish-url](https://github.com/marketplace/actions/deploy-to-cloudflare-workers-with-wrangler-and-get-publish-url)
16. `versions` commands do not set `deployment-url` · Issue #343 · cloudflare/wrangler-action, consulté le novembre 27, 2025, [https://github.com/cloudflare/wrangler-action/issues/343](https://github.com/cloudflare/wrangler-action/issues/343)
17. Running Lighthouse on Authenticated Pages with Puppeteer, consulté le novembre 27, 2025, [https://ethcar.github.io/lighthouse/docs/recipes/auth/](https://ethcar.github.io/lighthouse/docs/recipes/auth/)
18. docs/authenticated-pages.md · eb1d6c829693095ff15cf9c107c635bf94d2e7f1 · Saavan Nanavati / Lighthouse CI - GitLab, consulté le novembre 27, 2025, [https://gitlab.com/saavan/lighthouse-ci/-/blob/eb1d6c829693095ff15cf9c107c635bf94d2e7f1/docs/authenticated-pages.md](https://gitlab.com/saavan/lighthouse-ci/-/blob/eb1d6c829693095ff15cf9c107c635bf94d2e7f1/docs/authenticated-pages.md)
19. Payload CMS: Add A Custom Create Account Screen In Admin UI - DEV Community, consulté le novembre 27, 2025, [https://dev.to/aaronksaunders/payload-cms-add-a-custom-create-account-screen-in-admin-ui-2pdg](https://dev.to/aaronksaunders/payload-cms-add-a-custom-create-account-screen-in-admin-ui-2pdg)
20. Implementing 2FA · payloadcms payload · Discussion #2555 - GitHub, consulté le novembre 27, 2025, [https://github.com/payloadcms/payload/discussions/2555](https://github.com/payloadcms/payload/discussions/2555)
21. How to set up Payload CMS authentication with Okta via OpenID Connect (OIDC/OAuth 2.0)? #1555 - GitHub, consulté le novembre 27, 2025, [https://github.com/payloadcms/payload/discussions/1555](https://github.com/payloadcms/payload/discussions/1555)
22. How to Use Lighthouse for Performance Audits - PixelFreeStudio Blog, consulté le novembre 27, 2025, [https://blog.pixelfreestudio.com/how-to-use-lighthouse-for-performance-audits/](https://blog.pixelfreestudio.com/how-to-use-lighthouse-for-performance-audits/)
23. Text content does not match server-rendered HTML | Next.js, consulté le novembre 27, 2025, [https://nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)
24. Hydration Error in Next.js 15 with React 19 Due to cz-shortcut-listen="true" Attribute Injection from Colorzilla Extension #72035 - GitHub, consulté le novembre 27, 2025, [https://github.com/vercel/next.js/discussions/72035](https://github.com/vercel/next.js/discussions/72035)
25. next CLI - Next.js, consulté le novembre 27, 2025, [https://nextjs.org/docs/app/api-reference/cli/next](https://nextjs.org/docs/app/api-reference/cli/next)
26. Reducing flaky builds by 18x - The GitHub Blog, consulté le novembre 27, 2025, [https://github.blog/engineering/engineering-principles/reducing-flaky-builds-by-18x/](https://github.blog/engineering/engineering-principles/reducing-flaky-builds-by-18x/)
27. Dealing with flaky GitHub Actions - epiforecasts, consulté le novembre 27, 2025, [https://epiforecasts.io/posts/2022-04-11-robust-actions/](https://epiforecasts.io/posts/2022-04-11-robust-actions/)
28. What do the scores mean in `lighthouse-ci`? - Stack Overflow, consulté le novembre 27, 2025, [https://stackoverflow.com/questions/79189903/what-do-the-scores-mean-in-lighthouse-ci](https://stackoverflow.com/questions/79189903/what-do-the-scores-mean-in-lighthouse-ci)
29. Next.js performance tuning: practical fixes for better Lighthouse scores - QED42, consulté le novembre 27, 2025, [https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores)
30. GitHub Apps - Lighthouse CI, consulté le novembre 27, 2025, [https://github.com/apps/lighthouse-ci](https://github.com/apps/lighthouse-ci)
31. Running Lighthouse CI on All Modified Next.js Pages using GitHub Actions, consulté le novembre 27, 2025, [https://www.bswanson.dev/blog/run-lighthouse-ci-on-changed-pages/](https://www.bswanson.dev/blog/run-lighthouse-ci-on-changed-pages/)
32. Performance Audits with Lighthouse CI & GitHub Actions - DEV Community, consulté le novembre 27, 2025, [https://dev.to/jacobandrewsky/performance-audits-with-lighthouse-ci-github-actions-3g0g](https://dev.to/jacobandrewsky/performance-audits-with-lighthouse-ci-github-actions-3g0g)
33. Auth unique email · payloadcms payload · Discussion #3560 - GitHub, consulté le novembre 27, 2025, [https://github.com/payloadcms/payload/discussions/3560](https://github.com/payloadcms/payload/discussions/3560)
