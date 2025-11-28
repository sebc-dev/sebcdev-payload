# Story 1.1 - Initialisation & Déploiement 1-Click

**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Story ID**: 1.1
**Created**: 2025-11-28
**Status**: 📋 PLANNING

---

## 📖 Story Description

**En tant que** Développeur,
**Je veux** utiliser le bouton "Deploy to Cloudflare" du template officiel `with-cloudflare-d1`,
**Afin de** provisionner automatiquement le Repo GitHub, la base D1, le bucket R2 et le Worker.

---

## 🎯 Objectives

Cette story établit les fondations de l'infrastructure en utilisant le template officiel Payload CMS pour Cloudflare. L'objectif est de provisionner automatiquement toute l'infrastructure nécessaire sans configuration manuelle complexe.

**Objectifs clés**:
1. Créer un nouveau repository GitHub à partir du template officiel
2. Provisionner automatiquement la base de données Cloudflare D1
3. Créer le bucket Cloudflare R2 pour le stockage des médias
4. Déployer le Worker Cloudflare initial
5. Configurer les bindings entre le Worker, D1 et R2

---

## ✅ Acceptance Criteria

### AC1: Template Deployed
- [ ] Le repository GitHub est créé à partir du template `with-cloudflare-d1`
- [ ] Le repository contient tous les fichiers du template (code source, configuration)
- [ ] Le repository est accessible et clonable

### AC2: Cloudflare Infrastructure Provisioned
- [ ] La base de données Cloudflare D1 est créée automatiquement
- [ ] Le bucket Cloudflare R2 est créé automatiquement
- [ ] Le Worker Cloudflare est déployé et accessible
- [ ] Les bindings entre Worker, D1 et R2 sont configurés dans `wrangler.toml`

### AC3: Application Accessible
- [ ] L'application est accessible via l'URL Cloudflare Workers
- [ ] La page d'accueil se charge sans erreur
- [ ] Le panneau admin Payload est accessible (même s'il n'est pas configuré)

### AC4: Configuration Verified
- [ ] Le fichier `wrangler.toml` contient les bonnes références aux ressources
- [ ] Les variables d'environnement nécessaires sont documentées
- [ ] Les credentials Cloudflare sont sauvegardés de manière sécurisée

---

## 🔗 Dependencies

### Upstream Dependencies
- Aucune (première story de l'epic)

### Downstream Dependencies
- **Story 1.2**: Récupération & Configuration Locale (nécessite l'infrastructure provisionnée)
- **Story 1.3**: Pipeline "Quality Gate" (peut être développé en parallèle)

### External Dependencies
- **Cloudflare Account**: Compte Cloudflare avec accès aux Workers, D1, et R2
- **GitHub Account**: Compte GitHub pour créer le repository
- **Template Availability**: Template officiel `payloadcms/payload` avec le starter `with-cloudflare-d1`

---

## 📊 Technical Requirements

### Infrastructure Components
1. **GitHub Repository**
   - Nom: `sebcdev-payload` (ou selon préférence)
   - Visibilité: Public ou Private
   - Source: Template `with-cloudflare-d1`

2. **Cloudflare D1 Database**
   - Nom: `sebcdev-payload-db` (ou auto-généré)
   - Type: SQLite distribué
   - Binding: `DB` (référencé dans le code)

3. **Cloudflare R2 Bucket**
   - Nom: `sebcdev-payload-media` (ou auto-généré)
   - Type: Object storage S3-compatible
   - Binding: `MEDIA_BUCKET` (référencé dans le code)

4. **Cloudflare Worker**
   - Nom: `sebcdev-payload` (ou selon projet)
   - Runtime: `workerd` avec `nodejs_compat`
   - Adaptateur: `@opennextjs/cloudflare`

### Configuration Files
- `wrangler.toml`: Configuration Cloudflare (bindings, compatibility flags)
- `package.json`: Dépendances et scripts
- `next.config.mjs`: Configuration Next.js
- `open-next.config.ts`: Configuration OpenNext pour Cloudflare
- `payload.config.ts`: Configuration Payload CMS

---

## 🚨 Risks & Mitigations

### High-Risk Items

**Risk 1: Template Incompatibility**
- **Description**: Le template officiel pourrait ne pas être à jour ou compatible avec la dernière version de Payload
- **Likelihood**: Faible
- **Impact**: Élevé (blocage complet)
- **Mitigation**: Vérifier la version du template avant déploiement, consulter la documentation officielle
- **Contingency**: Utiliser une version spécifique du template connue pour être stable

**Risk 2: Cloudflare Quota Limits**
- **Description**: Le compte Cloudflare pourrait avoir des limites (Workers gratuits, taille D1)
- **Likelihood**: Moyenne
- **Impact**: Moyen (peut nécessiter upgrade du plan)
- **Mitigation**: Vérifier les quotas du compte avant déploiement
- **Contingency**: Créer un nouveau compte ou upgrader le plan existant

**Risk 3: Deployment Failure**
- **Description**: Le déploiement automatique pourrait échouer en raison d'erreurs de configuration
- **Likelihood**: Faible
- **Impact**: Moyen (nécessite debug manuel)
- **Mitigation**: Suivre exactement les instructions du template, vérifier les logs
- **Contingency**: Déploiement manuel via Wrangler CLI

---

## 📝 Technical Notes

### Important Considerations

1. **Template Selection**: Le template `with-cloudflare-d1` est spécifiquement conçu pour Cloudflare Workers avec D1 et R2

2. **Compatibility Flags**: Le template nécessite `nodejs_compat` dans `wrangler.toml` pour faire fonctionner Payload CMS

3. **Environment Variables**: Le template utilise `.dev.vars` pour les variables locales et `wrangler secret` pour les secrets en production

4. **Initial Migration**: Le template inclut une migration initiale pour créer les tables Payload de base

5. **Admin User**: Après le déploiement, il faudra créer le premier utilisateur admin (Story 1.2)

### Related Documentation
- [Payload CMS Official Templates](https://github.com/payloadcms/payload/tree/main/templates)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

## 🎬 User Value

Cette story établit les fondations techniques du projet en quelques clics, permettant de:
- **Gagner du temps**: Évite des heures de configuration manuelle d'infrastructure
- **Réduire les erreurs**: Le template est testé et validé par Payload CMS
- **Accélérer le développement**: L'équipe peut immédiatement commencer à travailler sur les fonctionnalités
- **Garantir les bonnes pratiques**: Le template suit les recommandations officielles de Payload et Cloudflare

---

**Story Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (story-phase-planner skill)
