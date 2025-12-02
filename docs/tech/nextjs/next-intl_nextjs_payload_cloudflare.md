# **Architecture et Implémentation Avancée de l’Internationalisation : Next.js, Next-intl et Payload 3 sur Cloudflare Workers**

## **1\. Introduction et Changement de Paradigme Architectural**

En novembre 2025, le paysage du développement web a atteint un point de convergence critique. La séparation historique entre le rendu dynamique côté serveur (SSR), la gestion de contenu (CMS) et l'infrastructure de distribution (CDN/Edge) s'est effondrée au profit d'une architecture unifiée, exécutée en bordure de réseau. Ce rapport traite de l'implémentation d'une stack technologique de pointe combinant **Next.js** (framework React full-stack), **next-intl** (gestionnaire d'internationalisation), et **Payload CMS 3.0** (système de gestion de contenu headless), le tout orchestré au sein de l'environnement serverless de **Cloudflare Workers**.  
Cette combinaison ne représente pas simplement une "mise à jour" des pratiques de 2023 ou 2024, mais une refonte fondamentale de la manière dont les applications mondiales sont conçues. L'objectif n'est plus seulement de servir des fichiers statiques rapidement, mais d'exécuter une logique métier complexe, incluant l'accès aux bases de données et le rendu de pages personnalisées par langue, à quelques millisecondes de l'utilisateur final.

### **1.1 L'Avènement de Payload 3.0 "Native" et son Impact**

L'élément déclencheur de cette nouvelle architecture est la transition de Payload CMS vers une version 3.0 dite "Next.js Native". Contrairement aux itérations précédentes qui nécessitaient souvent un serveur Express.js dédié ou un processus Node.js persistant, Payload 3.0 s'importe désormais comme une bibliothèque directement au sein de l'application Next.js.1 Cette fusion architecturale a des implications profondes pour le déploiement sur Cloudflare Workers :

* **Unification du Runtime :** Le CMS et le frontend partagent le même cycle de vie de requête et le même contexte d'exécution. Cela élimine la latence réseau inhérente aux architectures microservices classiques où le frontend doit effectuer des requêtes HTTP vers une API CMS distante.  
* **Accès Direct aux Données (Local API) :** Grâce à cette intégration, les Server Components de Next.js peuvent interroger la base de données (Cloudflare D1) via la "Local API" de Payload, contournant totalement la couche HTTP et la sérialisation JSON, offrant des performances de lecture inégalées.4

### **1.2 Le Défi de l'Environnement Cloudflare Workers**

Héberger une telle stack sur Cloudflare Workers impose de naviguer dans un environnement de contraintes strictes mais puissantes. Contrairement aux conteneurs Docker (comme sur Vercel ou AWS Fargate), les Workers utilisent des *Isolates V8*.

* **Avantages :** Le temps de démarrage à froid (cold start) est quasi inexistant, ce qui est critique pour une expérience utilisateur fluide sur des sites internationaux où le trafic peut être sporadique sur certaines locales.5  
* **Contraintes :** La compatibilité Node.js n'est pas totale (bien que grandement améliorée par le flag nodejs\_compat), et surtout, la taille du bundle est strictement limitée (10 MB compressés pour les plans payants).6 Cette limite de taille devient le défi central lors de l'intégration de Payload, Next.js et des bibliothèques d'internationalisation dans un seul déploiement.

## ---

**2\. Infrastructure et Topologie des Données sur l'Edge**

Pour garantir une performance optimale d'une application internationalisée (i18n), l'architecture des données doit être pensée pour la distribution géographique. L'utilisation de Cloudflare D1 (base de données SQL distribuée) et R2 (stockage d'objets) est impérative.

### **2.1 Cloudflare D1 : La Stratégie de Base de Données Relationnelle Distribuée**

Payload 3.0 introduit un support officiel pour D1 via son adaptateur @payloadcms/db-d1-sqlite. D1 est construit sur SQLite, ce qui diffère des bases PostgreSQL traditionnellement utilisées avec Payload.

#### **2.1.1 Nuances de SQLite pour l'Internationalisation**

L'implémentation de l'i18n dans la base de données nécessite une attention particulière :

* **Stockage des Champs Localisés :** Payload gère la localisation soit par duplication de documents (rare), soit par localisation au niveau des champs. Dans le cas de D1/SQLite, Payload structure les données en utilisant des tables relationnelles supplémentaires pour les locales ou, plus fréquemment pour des raisons de performance, des structures JSON.  
* **Limitations de l'Indexation JSON :** Contrairement à PostgreSQL qui possède un type JSONB binaire hautement performant, SQLite stocke le JSON sous forme de texte. Bien que D1 supporte les fonctions json\_extract, l'indexation de clés spécifiques à l'intérieur d'un blob JSON localisé (par exemple, filtrer par slug en français) peut être moins performante si elle n'est pas explicitement gérée par des colonnes générées ou des tables de jointure.8  
* **Implication :** Il est crucial de configurer Payload pour qu'il utilise des index sur les champs de recherche critiques (comme les slugs d'URL) afin d'éviter des scans complets de table (Full Table Scans) qui ralentiraient le rendu des pages.10

#### **2.1.2 Réplication et Latence**

D1 offre des fonctionnalités de "Time Travel" et de réplication en lecture. Pour une application i18n, cela signifie que les données de contenu (souvent lues, rarement écrites) peuvent être répliquées près des utilisateurs finaux, réduisant la latence de récupération du contenu traduit. Cependant, il faut être conscient de la cohérence éventuelle : une mise à jour de traduction dans l'admin (situé par exemple aux US) peut prendre quelques centaines de millisecondes pour se propager aux réplicas en Asie ou en Europe.

### **2.2 Cloudflare R2 : Gestion des Assets Multilingues**

Les applications internationalisées nécessitent souvent des assets spécifiques par locale (images contenant du texte, documents PDF légaux). Cloudflare R2 est le choix par défaut pour le stockage, étant donné l'absence de système de fichiers persistant sur les Workers.5

* **Binding :** Le bucket R2 doit être lié au Worker via wrangler.toml.  
* **Serveur de Médias :** Payload offre un plugin @payloadcms/plugin-cloud-storage. Pour maximiser les performances, il est recommandé de servir les fichiers publics directement via le CDN Cloudflare pointant sur le bucket R2, plutôt que de streamer les fichiers à travers le Worker Payload, ce qui consommerait inutilement du temps CPU et de la mémoire.11

## ---

**3\. Architecture de Déploiement : Monolithe vs Service Bindings**

L'une des décisions les plus critiques en novembre 2025 pour cette stack est le choix entre une architecture monolithique et une architecture orientée services, dictée par la limite de taille des Workers.

### **3.1 L'Approche Monolithique (OpenNext Standard)**

Dans cette configuration, l'application Next.js, incluant Payload et next-intl, est compilée en un seul script Worker.

* **Processus :** L'adaptateur @opennextjs/cloudflare analyse le build Next.js, identifie les API Node.js utilisées, injecte les polyfills nécessaires, et package le tout.12  
* **Risque de Saturation :** Une application Payload typique avec quelques collections, l'éditeur Lexical, et les dépendances de validation (Zod, etc.) pèse lourd. Il est fréquent d'atteindre la limite de 10 MB (gzip).  
* **Optimisation :** Pour réussir ce déploiement, il faut désactiver les paquets de développement dans le build de production et utiliser des imports dynamiques pour les composants d'administration (admin: { bundler:... }) afin qu'ils ne soient pas chargés sur les routes publiques.14

### **3.2 L'Approche "Split Worker" via Service Bindings (Recommandation Expert)**

Pour contourner les limites de taille et séparer les préoccupations, l'architecture recommandée pour les projets d'envergure est de scinder l'application en deux Workers distincts communiquant via **Service Bindings (RPC)**.16

#### **3.2.1 Worker A : Frontend (Next.js \+ next-intl)**

Ce Worker est responsable du rendu, du routage i18n et de l'expérience utilisateur.

* Il contient le code Next.js (App Router).  
* Il gère le middleware next-intl pour la détection de la langue.  
* Il est léger car il ne contient *pas* le cœur de Payload CMS.

#### **3.2.2 Worker B : Backend CMS (Payload 3\)**

Ce Worker héberge l'instance Payload, la connexion D1, et la logique métier de gestion de contenu.

* Il expose une API RPC typée (via WorkerEntrypoint) que le Worker A peut appeler.  
* Il gère les webhooks et l'interface d'administration /admin.

#### **3.2.3 Implémentation du RPC pour la Local API**

Au lieu d'utiliser payload.find() directement dans le Worker A (ce qui nécessiterait d'importer tout le code de Payload), le Worker A appelle une méthode sur le Worker B.  
*Exemple de structure RPC :*

TypeScript

// Worker B (CMS) \- src/index.ts  
import { WorkerEntrypoint } from 'cloudflare:workers';  
import { getPayload } from './payload'; 

export class PayloadService extends WorkerEntrypoint {  
  async getLocalizedPage(slug: string, locale: string) {  
    const payload \= await getPayload();  
    return payload.find({  
      collection: 'pages',  
      where: { slug: { equals: slug } },  
      locale: locale,  
      depth: 1,  
    });  
  }  
}  
export default {... }

TypeScript

// Worker A (Frontend) \- env.d.ts  
interface Env {  
  PAYLOAD\_SERVICE: Service\<import('../cms/src/index').PayloadService\>;  
}

// Worker A \- app/\[locale\]/page.tsx  
export default async function Page({ params }) {  
  const { locale, slug } \= params;  
  // Appel RPC direct sans overhead HTTP  
  const data \= await process.env.PAYLOAD\_SERVICE.getLocalizedPage(slug, locale);  
  //...  
}

Cette méthode permet non seulement de respecter les quotas de taille, mais aussi de déployer le frontend et le CMS indépendamment, tout en conservant une latence d'appel négligeable (les appels RPC se font en mémoire ou via des sockets Unix internes au nœud Cloudflare).16

## ---

**4\. Configuration Avancée de Payload 3.0 pour l'Internationalisation**

L'implémentation de l'i18n dans Payload ne se limite pas à activer une option. Elle doit être alignée avec la structure de la base de données D1 et les besoins du frontend Next.js.

### **4.1 Stratégie de Localisation : Champs vs Documents**

Payload offre deux approches principales : la localisation au niveau des documents (un document par langue) ou au niveau des champs (un document unique, champs multilingues).

* **Recommandation : Localisation au Niveau des Champs.** C'est la méthode la plus robuste pour maintenir la cohérence des relations entre les données. Si vous avez une relation entre un "Article" et une "Catégorie", vous ne voulez pas gérer cette relation trois fois pour trois langues. Avec la localisation des champs, l'ID du document reste le même, seules les valeurs des champs (title, content) changent.18

### **4.2 Configuration du payload.config.ts**

La configuration doit définir explicitement les locales et le comportement de repli (fallback).

TypeScript

import { buildConfig } from 'payload';

export default buildConfig({  
  //...  
  localization: {  
    locales:,  
    defaultLocale: 'en', // Locale de référence interne  
    fallback: true,      // Crucial : permet d'afficher l'anglais si le français manque  
  },  
  //...  
});

#### **4.2.1 Gestion des Slugs Multilingues**

C'est un piège classique. Les URLs doivent être localisées pour le SEO (/en/about, /fr/a-propos).

* **Configuration du Champ :** Le champ slug doit être marqué localized: true.  
* **Unicité :** Dans une base SQL comme D1, assurer l'unicité d'un champ JSON est complexe. Cependant, Payload gère cela au niveau applicatif. Il faut s'assurer que pour une locale donnée, le slug est unique.  
* **Indexation :** Pour garantir la performance des requêtes D1 lors de la résolution de l'URL, il est impératif d'activer l'indexation sur le champ slug : index: true. Payload créera les index composites nécessaires dans SQLite.10

### **4.3 Piège de la Performance JSON dans D1**

Lorsque vous utilisez des champs complexes comme blocks ou array localisés, Payload stocke souvent ces données sous forme de gros objets JSON dans D1.

* **Problème :** Si vous devez filtrer des documents basés sur une valeur imbriquée dans un bloc localisé (ex: trouver toutes les pages ayant un bloc "Héros" avec un titre spécifique en français), la requête SQL générée utilisera json\_extract. Sur de gros volumes de données, cela peut être lent.  
* **Solution :** Évitez de filtrer sur des champs imbriqués profondément dans des structures JSON localisées. Si un champ doit être filtrable, essayez de le remonter au premier niveau de la collection ou utilisez le plugin search de Payload pour créer une collection d'index de recherche dédiée et optimisée.20

## ---

**5\. Implémentation du Frontend Next.js avec Next-intl**

L'intégration de next-intl avec l'App Router de Next.js sur Cloudflare Workers demande une rigueur particulière dans la gestion du middleware et du routage.

### **5.1 Structure de Routage et Middleware**

L'approche standard consiste à utiliser un segment dynamique \[locale\] à la racine du dossier app.

#### **5.1.1 Le Middleware : Orchestrateur Critique**

Le fichier middleware.ts est exécuté à chaque requête. Sur Cloudflare Workers, chaque milliseconde de temps CPU compte.

* **Configuration du Matcher :** Il est vital d'exclure les routes API de Payload (/api/\*), les fichiers statiques (/\_next/\*, /favicon.ico) et les assets publics du traitement par le middleware next-intl. Le middleware i18n ne doit traiter que les pages vues par l'utilisateur.  
  TypeScript  
  export const config \= {  
    matcher: \['/((?\!api|\_next|\_vercel|.\*\\\\..\*).\*)'\]  
  };

* **Chaînage avec l'Authentification :** Si vous utilisez Payload Auth ou une autre solution, vous ne pouvez pas exporter plusieurs middlewares. Vous devez composer les fonctions. Le pattern recommandé est d'exécuter d'abord la logique de sécurité/auth, puis, si la requête est autorisée, de passer la main au middleware next-intl pour la réécriture d'URL.21

### **5.2 Chargement des Traductions et Configuration de Requête**

Avec la version de novembre 2025, next-intl utilise i18n/request.ts (remplaçant les anciennes configurations).

* **Architecture Hybride :**  
  * Les chaînes de caractères de l'interface utilisateur (boutons, navigation fixe) doivent être chargées depuis des fichiers JSON locaux (ex: messages/fr.json) pour une performance maximale et une gestion via Git.  
  * Le contenu éditorial (articles, pages) provient de Payload.  
* Integration Server Components :  
  L'utilisation de await getTranslations() dans les Server Components est non bloquante. Cependant, pour le contenu Payload, on n'utilise pas next-intl pour charger le contenu, mais la Local API de Payload directement. next-intl sert ici à formater les dates, les nombres et les chaînes fixes autour du contenu dynamique.

### **5.3 Gestion de unstable\_setRequestLocale**

Pour permettre l'optimisation statique (Static Site Generation \- SSG) sur Cloudflare, il est impératif d'appeler unstable\_setRequestLocale(locale) (ou son successeur stable) au début de chaque layout.tsx et page.tsx. Cela informe Next.js que la locale est connue et fixe pour ce rendu, évitant de basculer inutilement en rendu dynamique coûteux.23

## ---

**6\. Flux de Données et Performance : De la Base de Données au Client**

C'est ici que l'architecture "Native" de Payload brille, mais nécessite une optimisation fine.

### **6.1 Utilisation de la Local API dans les Server Components**

Au lieu d'utiliser fetch(), on utilise payload.find().

TypeScript

// app/\[locale\]/\[slug\]/page.tsx  
import { getPayload } from 'payload';  
import configPromise from '@payload-config';

export default async function Page({ params }) {  
  const { slug, locale } \= params;  
  const payload \= await getPayload({ config: configPromise });

  const result \= await payload.find({  
    collection: 'pages',  
    where: { slug: { equals: slug } },  
    locale: locale, // Important : passer la locale ici  
    depth: 1, // Limiter la profondeur pour économiser la bande passante D1  
  });  
  //...  
}

**Point Critique :** Passer l'argument locale à payload.find est essentiel. Si vous l'omettez, Payload retourne *toutes* les locales (title: { fr: '...', en: '...' }), ce qui augmente inutilement la taille des données transférées depuis D1 et le traitement CPU. En spécifiant la locale, Payload effectue le filtrage (et le fallback) avant de retourner l'objet, réduisant la charge mémoire.4

### **6.2 Stratégie de Caching Granulaire (ISR)**

Sur Cloudflare Workers, chaque lecture D1 est facturée et prend du temps. Le cache est donc obligatoire.

* **unstable\_cache (ou use cache) :** Enveloppez vos appels à la Local API avec la fonction de cache de Next.js.  
  TypeScript  
  import { unstable\_cache } from 'next/cache';

  const getCachedPage \= unstable\_cache(  
    async (slug, locale) \=\> { /\* appel payload \*/ },  
    \['pages-slug'\],   
    { tags: \[\`page\_${slug}\`, \`locale\_${locale}\`\] }  
  );

* **Invalidation Intelligente :** C'est le défi majeur. Lorsque vous modifiez une page dans Payload, le cache Next.js doit être invalidé.  
  * Utilisez les **Hooks** de collection Payload (afterChange).  
  * Dans le hook, appelez revalidateTag.  
  * *Piège de l'Architecture Split :* Si vous êtes en architecture "Split Worker", le hook s'exécute dans le Worker B, mais le cache est géré par le Worker A (ou le système de cache partagé OpenNext). Vous devez implémenter un mécanisme (webhook interne ou appel RPC) pour que le Worker B ordonne au Worker A d'invalider le tag.24

### **6.3 Génération de Métadonnées SEO et hreflang**

Pour un SEO international correct, chaque page doit indiquer ses variantes linguistiques.

* Utilisez generateMetadata de Next.js.  
* Effectuez une requête Payload spécifique (légère, avec select: { slug: true }) sans spécifier de locale (locale: 'all') pour récupérer les slugs dans toutes les langues disponibles pour ce document.  
* Construisez l'objet alternates pour Next.js qui générera les balises \<link rel="alternate" hreflang="..." /\>.26

## ---

**7\. Bonnes Pratiques et Pièges à Éviter (Checklist Expert)**

### **7.1 Les Pièges de la Taille du Bundle**

* **Évitez les barrel files géants :** N'importez pas depuis index.ts racine si cela tire des dépendances serveur dans le client.  
* **Analysez le bundle :** Utilisez @next/bundle-analyzer régulièrement. Les dépendances comme faker, sharp (si mal configuré) ou des validateurs lourds sont souvent les coupables.  
* **Externalisation :** Configurez serverExternalPackages dans next.config.js pour certaines libs Node.js si vous utilisez le runtime nodejs\_compat, afin qu'elles ne soient pas bundlées inutilement si elles sont déjà présentes dans l'environnement (bien que sur Workers, le concept d'external est limité).

### **7.2 Problèmes d'Hydratation (Dates et Timezones)**

Un problème classique en i18n est le rendu des dates. Le Worker Cloudflare tourne en UTC. Le navigateur client est en heure locale.

* **Erreur :** Rendre new Date().toLocaleDateString() dans un Server Component. Le HTML contiendra la date UTC, mais lors de l'hydratation, le client recalculera la date locale, causant une erreur "Text content does not match server-rendered HTML".  
* **Solution :** Passez toujours une timeZone explicite au NextIntlClientProvider ou formatez la date en chaîne statique côté serveur avant de l'envoyer au client.

### **7.3 Latence D1 et "Smart Placement"**

Bien que D1 soit distribué, il existe une instance "primaire" pour les écritures. Si votre Worker est en Australie et le primaire D1 en Europe, chaque écriture sera lente.

* **Bonne Pratique :** Activez le **Smart Placement** (anciennement Smart Placement) de Cloudflare pour vos Workers. Cloudflare déplacera automatiquement l'exécution de votre Worker près de la base de données D1 pour minimiser la latence des allers-retours.16

### **7.4 Gestion des Mises à Jour de Payload**

L'écosystème évolue vite. Verrouillez vos versions de dépendances (package.json) pour éviter qu'une mise à jour mineure de payload ou @opennextjs/cloudflare ne casse votre build de production. Testez toujours les mises à jour en local avec wrangler dev en mode remote pour simuler l'accès réel à D1/R2.

## **8\. Tableaux Récapitulatifs**

### **Tableau 1 : Comparaison des Architectures de Déploiement**

| Caractéristique | Architecture Monolithique | Architecture "Split Worker" (RPC) |
| :---- | :---- | :---- |
| **Complexité** | Faible (1 projet, 1 déploiement) | Élevée (2 projets, binding, types partagés) |
| **Gestion Bundle Size** | Difficile (Risque élevé de dépasser 10MB) | Excellente (Frontend et Backend isolés) |
| **Latence** | Nulle (Même processus) | Quasi-nulle (Binding RPC mémoire/socket) |
| **Cache ISR** | Simple (revalidateTag direct) | Complexe (Nécessite coordination inter-worker) |
| **Coût Cloudflare** | 1 Invocation par requête | Potentiellement 2 Invocations (Front \+ Back) |
| **Recommandation** | Projets simples / MVP | Projets Entreprise / E-commerce complexe |

### **Tableau 2 : Liste de Contrôle pour la Performance D1/i18n**

| Action | Pourquoi? | Impact |
| :---- | :---- | :---- |
| **Indexer le champ slug** | Éviter les scans complets lors du routage | Critique (TTFB) |
| **Utiliser locale dans find** | Réduire la taille du JSON retourné par la DB | Moyen (Bande passante) |
| **Activer Smart Placement** | Rapprocher le Worker de la DB D1 | Haut (Latence) |
| **Utiliser unstable\_cache** | Éviter de lire D1 à chaque requête | Critique (Coût & Vitesse) |
| **Externaliser les Assets (R2)** | Ne pas servir les images via le Worker | Haut (CPU Worker) |

## **9\. Conclusion**

L'implémentation de l'internationalisation avec Next.js, next-intl et Payload 3 sur Cloudflare Workers représente l'état de l'art du développement web en novembre 2025\. Elle offre une combinaison puissante de performance, de flexibilité et de scalabilité. Cependant, elle ne pardonne pas l'improvisation.  
La réussite de ce projet repose sur trois piliers :

1. **La discipline architecturale :** Choisir tôt entre monolithe et microservices (Service Bindings) pour gérer la contrainte de taille de bundle.  
2. **L'optimisation des données :** Comprendre comment Payload interagit avec D1 et optimiser les requêtes pour l'internationalisation.  
3. **La rigueur du Caching :** Implémenter une stratégie ISR solide pour concilier dynamisme du CMS et vitesse du statique.

En suivant ces directives et en évitant les pièges identifiés, vous serez en mesure de déployer une plateforme de contenu mondiale, résiliente et ultra-rapide, exploitant pleinement le potentiel du réseau Edge de Cloudflare.

#### **Sources des citations**

1. Payload on Workers: a full-fledged CMS, running entirely on Cloudflare's stack, consulté le décembre 2, 2025, [https://blog.cloudflare.com/payload-cms-workers/](https://blog.cloudflare.com/payload-cms-workers/)  
2. The Ultimate Guide To Using Next.js with Payload, consulté le décembre 2, 2025, [https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)  
3. Payload 3.0: The first CMS that installs directly into any Next.js app, consulté le décembre 2, 2025, [https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)  
4. Local API | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/local-api/overview](https://payloadcms.com/docs/local-api/overview)  
5. Cloudflare Workers | Build and deploy code with Easy-to Use Developer Tools, consulté le décembre 2, 2025, [https://www.cloudflare.com/developer-platform/products/workers/](https://www.cloudflare.com/developer-platform/products/workers/)  
6. Troubleshooting \- OpenNext, consulté le décembre 2, 2025, [https://opennext.js.org/cloudflare/troubleshooting](https://opennext.js.org/cloudflare/troubleshooting)  
7. Limits · Cloudflare Workers docs, consulté le décembre 2, 2025, [https://developers.cloudflare.com/workers/platform/limits/](https://developers.cloudflare.com/workers/platform/limits/)  
8. Query JSON \- D1 \- Cloudflare Docs, consulté le décembre 2, 2025, [https://developers.cloudflare.com/d1/sql-api/query-json/](https://developers.cloudflare.com/d1/sql-api/query-json/)  
9. Use indexes \- D1 \- Cloudflare Docs, consulté le décembre 2, 2025, [https://developers.cloudflare.com/d1/best-practices/use-indexes/](https://developers.cloudflare.com/d1/best-practices/use-indexes/)  
10. Indexes | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/database/indexes](https://payloadcms.com/docs/database/indexes)  
11. Production Deployment | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/production/deployment](https://payloadcms.com/docs/production/deployment)  
12. Cloudflare \- OpenNext, consulté le décembre 2, 2025, [https://opennext.js.org/cloudflare](https://opennext.js.org/cloudflare)  
13. Deploy your Next.js app to Cloudflare Workers with the Cloudflare adapter for OpenNext, consulté le décembre 2, 2025, [https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/](https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/)  
14. Performance | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/performance/overview](https://payloadcms.com/docs/performance/overview)  
15. Anyone running Next.js \+ open-next on Cloudflare Workers without pain? \- Reddit, consulté le décembre 2, 2025, [https://www.reddit.com/r/CloudFlare/comments/1p2vix3/anyone\_running\_nextjs\_opennext\_on\_cloudflare/](https://www.reddit.com/r/CloudFlare/comments/1p2vix3/anyone_running_nextjs_opennext_on_cloudflare/)  
16. Service bindings \- Runtime APIs · Cloudflare Workers docs, consulté le décembre 2, 2025, [https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/)  
17. Service bindings \- RPC (WorkerEntrypoint) · Cloudflare Workers docs, consulté le décembre 2, 2025, [https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/)  
18. Localization | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/configuration/localization](https://payloadcms.com/docs/configuration/localization)  
19. How To Implement Slugs for Content and SKUs for Products in Payload CMS (With Safe Uniqueness \+ Seeding) | Build with Matija, consulté le décembre 2, 2025, [https://www.buildwithmatija.com/blog/payload-cms-slugs-and-skus](https://www.buildwithmatija.com/blog/payload-cms-slugs-and-skus)  
20. Search Plugin | Documentation \- Payload CMS, consulté le décembre 2, 2025, [https://payloadcms.com/docs/plugins/search](https://payloadcms.com/docs/plugins/search)  
21. Authjs V5 middleware chaining · nextauthjs next-auth · Discussion \#8961 \- GitHub, consulté le décembre 2, 2025, [https://github.com/nextauthjs/next-auth/discussions/8961](https://github.com/nextauthjs/next-auth/discussions/8961)  
22. Implementing Multiple Middleware in Next.js: Combining NextAuth V(5) and Internationalization \- DEV Community, consulté le décembre 2, 2025, [https://dev.to/0xtanzim/implementing-multiple-middleware-in-nextjs-combining-nextauth-and-internationalization-d9](https://dev.to/0xtanzim/implementing-multiple-middleware-in-nextjs-combining-nextauth-and-internationalization-d9)  
23. Setup locale-based routing – Internationalization (i18n) for Next.js, consulté le décembre 2, 2025, [https://next-intl.dev/docs/routing/setup](https://next-intl.dev/docs/routing/setup)  
24. Functions: revalidateTag \- Next.js, consulté le décembre 2, 2025, [https://nextjs.org/docs/app/api-reference/functions/revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)  
25. Payload CMS \+ Next.js: Auto-Update Pages Without Rebuilding (ISR Tutorial) \- Reddit, consulté le décembre 2, 2025, [https://www.reddit.com/r/PayloadCMS/comments/1oj8h69/payload\_cms\_nextjs\_autoupdate\_pages\_without/](https://www.reddit.com/r/PayloadCMS/comments/1oj8h69/payload_cms_nextjs_autoupdate_pages_without/)  
26. Functions: generateMetadata \- Next.js, consulté le décembre 2, 2025, [https://nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)  
27. How to Use Canonical Tags and Hreflang for in Next.js 15 | Build with Matija, consulté le décembre 2, 2025, [https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags)