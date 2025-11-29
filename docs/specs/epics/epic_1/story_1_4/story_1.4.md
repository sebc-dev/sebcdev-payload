# Story 1.4 - Adaptation du Pipeline de Déploiement

**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Story Reference**: 1.4
**Created**: 2025-11-29
**Status**: Planning

---

## Story Description

**En tant que** DevOps, **je veux** conditionner le script de déploiement Cloudflare (`wrangler deploy`) à la réussite préalable de la "Quality Gate", **afin d'** empêcher toute mise en production de code non conforme ou insécurisé.

Cette story établit le dernier maillon de la chaîne de sécurité CI/CD en garantissant qu'aucun code ne peut atteindre la production sans avoir passé toutes les validations de qualité définies dans Story 1.3.

---

## Acceptance Criteria

### CA1: Branch Protection Configuration

- [ ] La branche `main` est protégée et requiert le status check `quality-gate` avant merge
- [ ] Les merges directs sans PR sont bloqués (require PR reviews)
- [ ] Les force pushes sont interdits sur `main`
- [ ] La documentation de la configuration branch protection est créée

### CA2: Deployment Workflow Integration

- [ ] Un workflow de déploiement est créé (`deploy.yml`) ou le workflow `quality-gate.yml` est étendu
- [ ] Le déploiement est conditionné à la réussite de tous les jobs de quality-gate
- [ ] Le workflow supporte les déploiements preview (PRs) et production (main)
- [ ] Les variables d'environnement nécessaires sont documentées

### CA3: Cloudflare OIDC Authentication

- [ ] L'authentification OIDC est configurée pour éliminer les secrets statiques
- [ ] Les permissions du workflow sont définies avec `id-token: write`
- [ ] Un fallback sur API Token est disponible si OIDC n'est pas encore configuré
- [ ] La documentation de configuration OIDC Cloudflare est créée

### CA4: Wrangler Deploy Integration

- [ ] La commande `wrangler deploy` est intégrée au workflow
- [ ] Les migrations D1 sont exécutées avant le déploiement (`pnpm payload migrate`)
- [ ] Les déploiements preview utilisent une branche/environnement isolé
- [ ] Les déploiements production sont sur l'environnement principal

### CA5: Deployment Validation

- [ ] Le workflow attend la disponibilité de l'URL après déploiement (`wait-for-url`)
- [ ] Un smoke test basique valide que le site est accessible
- [ ] Le workflow échoue proprement si le déploiement échoue
- [ ] Les URLs de déploiement sont affichées dans le GitHub Summary

### CA6: Rollback Strategy

- [ ] Une stratégie de rollback est documentée (revenir à un déploiement précédent)
- [ ] Les commandes de rollback manuel sont documentées
- [ ] Le workflow ne supprime jamais les déploiements précédents automatiquement

---

## Technical Requirements

### From PRD - ENF6 (AI-Shield)

Cette story implémente la partie "déploiement sécurisé" de ENF6:

- **OIDC Cloudflare**: Authentification sans secrets statiques (Phase 2 ENF6)
- **Permissions GITHUB_TOKEN**: Read-only par défaut, `id-token: write` pour OIDC
- **Déclenchement conditionnel**: Déploiement uniquement si Quality Gate passe

### From CI-CD-Security.md

Sections pertinentes:

- Section 5: OIDC pour Cloudflare
- Section 11.3: Structure du Workflow (deploy-preview job)
- Section 11.4: Workflow Développeur Recommandé

### Technical Dependencies

1. **Story 1.3** (Quality Gate): Le pipeline de qualité doit être fonctionnel
2. **Cloudflare Account**: Configuration OIDC ou API Token disponible
3. **Wrangler**: Déjà configuré dans le projet (`wrangler.jsonc`)
4. **D1 Database**: Migrations configurées

---

## Out of Scope

Les éléments suivants ne sont PAS dans le scope de cette story:

- Lighthouse CI integration (Story 1.3 Phase 7)
- Stryker mutation testing (Story 1.3 Phase 8)
- Preview environments pour chaque PR (peut être ajouté plus tard)
- Rollback automatique basé sur les métriques
- Blue-green deployment

---

## User Value

Cette story garantit que:

1. **Aucun code défaillant ne peut atteindre la production** - Le quality gate est obligatoire
2. **La sécurité est renforcée** - OIDC élimine les risques liés aux secrets statiques
3. **Le workflow développeur est fluide** - Le déploiement est automatique après validation
4. **La traçabilité est complète** - Chaque déploiement est lié à un commit validé

---

## Dependencies

### Story Dependencies

| Story | Dependency Type | Reason                                                 |
| ----- | --------------- | ------------------------------------------------------ |
| 1.1   | Hard            | Infrastructure Cloudflare doit exister                 |
| 1.2   | Hard            | Environnement local fonctionnel pour tester            |
| 1.3   | Hard            | Quality Gate doit être implémenté (Phases 1-5 minimum) |

### External Dependencies

| Dependency                 | Required For                      | Documentation   |
| -------------------------- | --------------------------------- | --------------- |
| Cloudflare Account         | OIDC setup, Wrangler deploy       | wrangler.jsonc  |
| GitHub Repository Settings | Branch protection                 | GitHub Settings |
| Socket.dev                 | Continued supply chain protection | socket.yml      |

---

## Risks

| Risk                               | Likelihood | Impact | Mitigation                                      |
| ---------------------------------- | ---------- | ------ | ----------------------------------------------- |
| OIDC configuration complexity      | Medium     | Medium | Fallback sur API Token, documentation détaillée |
| Déploiement échoue après migration | Low        | High   | Dry-run migrations, rollback strategy           |
| Temps de déploiement trop long     | Low        | Low    | Optimisation du build, caching                  |

---

## Success Metrics

| Metric                        | Target         | Measurement                     |
| ----------------------------- | -------------- | ------------------------------- |
| Deployment Success Rate       | > 95%          | GitHub Actions statistics       |
| Time to Deploy                | < 5 min        | Workflow execution time         |
| Zero unauthorized deployments | 100%           | Branch protection audit         |
| OIDC adoption                 | 100% (Phase 2) | No static API tokens in secrets |

---

## References

- PRD: `docs/specs/PRD.md` - Story 1.4 (line 307-308)
- CI-CD Security: `docs/specs/CI-CD-Security.md` - Sections 5, 11
- Quality Gate Workflow: `.github/workflows/quality-gate.yml`
- Wrangler Config: `wrangler.jsonc`
- Cloudflare OIDC: https://developers.cloudflare.com/workers/wrangler/ci-cd/github-actions/#oidc

---

**Story Extracted**: 2025-11-29
**Extracted by**: Claude Code (story-phase-planner skill)
