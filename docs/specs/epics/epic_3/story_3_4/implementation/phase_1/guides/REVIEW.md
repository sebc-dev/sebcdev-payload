# Phase 1: Review Guide

**Phase**: CI Unit & Integration Tests

---

## Review Checklist

### YAML Syntax
- [ ] Indentation correcte (2 espaces)
- [ ] Pas de tabs
- [ ] Strings multilignes correctement formatées
- [ ] Pas de caractères spéciaux non échappés

### Workflow Logic
- [ ] Steps dans le bon ordre (après Knip, avant Generate Payload Types)
- [ ] Conditions `if` correctes
- [ ] Variables d'environnement correctement référencées

### Security
- [ ] Pas de secrets hardcodés
- [ ] PAYLOAD_SECRET utilise le pattern `${{ secrets.X || env.Y }}`
- [ ] Pas de commandes dangereuses

---

## Code Review Points

### Commit 1: Unit Tests Step

```yaml
# ✅ GOOD
- name: Unit Tests
  run: pnpm test:unit

# ❌ BAD - ne pas utiliser npm
- name: Unit Tests
  run: npm test
```

### Commit 2: Integration Tests Step

```yaml
# ✅ GOOD - utilise le fallback CI secret
- name: Integration Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:int

# ❌ BAD - secret obligatoire, échoue si non configuré
- name: Integration Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}
  run: pnpm test:int
```

### Commit 3: Coverage Summary

```yaml
# ✅ GOOD - if: always() pour afficher même si tests échouent
- name: Coverage Summary
  if: always()
  run: |
    if [ -f coverage/coverage-summary.json ]; then
      # ...
    fi

# ❌ BAD - pas de condition, n'affiche pas si tests échouent
- name: Coverage Summary
  run: cat coverage/coverage-summary.json
```

---

## Testing the Changes

### Local Validation
```bash
# Valider syntaxe YAML
npx yaml-lint .github/workflows/quality-gate.yml

# Simuler les steps localement
pnpm test:unit --coverage
pnpm test:int
```

### CI Validation
1. Push les changements sur une branche feature
2. Ouvrir une PR vers main
3. Vérifier que le workflow se déclenche
4. Vérifier que les tests s'exécutent

---

## Common Issues

### Issue: Tests passent localement mais échouent en CI

**Causes possibles**:
- Différence de version Node.js
- Variables d'environnement manquantes
- Paths relatifs vs absolus

**Solution**:
- Vérifier la version Node.js dans le workflow
- Ajouter les variables d'environnement nécessaires
- Utiliser `process.cwd()` au lieu de paths relatifs

### Issue: Coverage JSON non généré

**Causes possibles**:
- `@vitest/coverage-v8` non installé
- Config coverage manquante dans vitest.config.ts
- Tests qui échouent avant génération

**Solution**:
- Installer le package coverage
- Ajouter la config dans vitest.config.ts
- Le step Coverage Summary utilise `if: always()`

### Issue: YAML syntax error

**Causes possibles**:
- Indentation incorrecte
- Caractères spéciaux dans les strings
- Quotes manquantes

**Solution**:
- Utiliser un linter YAML
- Vérifier l'indentation (2 espaces, pas de tabs)
- Échapper les caractères spéciaux

---

## Approval Criteria

### Required for Approval
- [ ] Tous les tests passent localement
- [ ] YAML syntaxiquement correct
- [ ] Pas de régressions sur le workflow existant
- [ ] Documentation à jour

### Nice to Have
- [ ] Coverage summary bien formaté
- [ ] Temps d'exécution raisonnable (< 2 min pour unit + int tests)

---

**Review Guide Created**: 2025-12-05
