# Phase 1 - Testing Guide

Testing strategy for Phase 1 configuration files.

---

## 🎯 Testing Strategy

Phase 1 is primarily a configuration phase. Testing focuses on **validation** rather than traditional unit tests:

1. **TypeScript Compilation**: Ensures types are correct
2. **Linting**: Ensures code quality and style
3. **JSON Validation**: Ensures message files are valid
4. **Configuration Tests**: Optional unit tests for utilities

**Target Coverage**: N/A (configuration phase)
**Estimated Validation Time**: 10-15 minutes

---

## 🧪 Primary Validation (Required)

### TypeScript Compilation

The most important validation for Phase 1. Ensures:
- All imports resolve correctly
- Type definitions are valid
- next-intl APIs are used correctly

```bash
# Run TypeScript check
pnpm exec tsc --noEmit
```

**Expected Result**: No errors

**Common Errors**:

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'next-intl'` | Package not installed | Run `pnpm add next-intl@^4` |
| `Cannot find module '../messages/fr.json'` | Wrong path | Check relative path from `src/i18n/request.ts` |
| `Type 'string' is not assignable to type 'Locale'` | Missing type narrowing | Use `isValidLocale()` helper |

### Linting

Ensures code follows project conventions:

```bash
# Run ESLint
pnpm lint
```

**Expected Result**: No errors or warnings

**Common Issues**:

| Issue | Cause | Fix |
|-------|-------|-----|
| `Empty interface` | `IntlMessages extends Messages` | Add ESLint disable comment |
| Unused import | Import not used | Remove unused import |
| Formatting | Code not formatted | Run `pnpm format` |

### JSON Validation

Ensures message files are valid JSON:

```bash
# Validate French messages
node -e "JSON.parse(require('fs').readFileSync('./messages/fr.json', 'utf8'))"

# Validate English messages
node -e "JSON.parse(require('fs').readFileSync('./messages/en.json', 'utf8'))"
```

**Expected Result**: No output (success) or JSON parse error

**Common JSON Errors**:

| Error | Cause | Fix |
|-------|-------|-----|
| `Unexpected token` | Trailing comma | Remove comma before `}` or `]` |
| `Unexpected end of JSON` | Missing bracket | Check for balanced `{}` and `[]` |
| `Bad control character` | Invalid escape | Use proper escaping for special chars |

---

## 🧪 Optional Unit Tests

While not required for Phase 1, you may add unit tests for the configuration utilities:

### Test File: `tests/unit/i18n-config.spec.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, isValidLocale, type Locale } from '@/i18n/config';

describe('i18n configuration', () => {
  describe('locales', () => {
    it('should contain French and English', () => {
      expect(locales).toContain('fr');
      expect(locales).toContain('en');
    });

    it('should have exactly 2 locales', () => {
      expect(locales).toHaveLength(2);
    });

    it('should have French first (as default)', () => {
      expect(locales[0]).toBe('fr');
    });
  });

  describe('defaultLocale', () => {
    it('should be French', () => {
      expect(defaultLocale).toBe('fr');
    });

    it('should be a valid locale', () => {
      expect(locales).toContain(defaultLocale);
    });
  });

  describe('isValidLocale', () => {
    it('should return true for valid locales', () => {
      expect(isValidLocale('fr')).toBe(true);
      expect(isValidLocale('en')).toBe(true);
    });

    it('should return false for invalid locales', () => {
      expect(isValidLocale('de')).toBe(false);
      expect(isValidLocale('es')).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });

    it('should narrow type correctly', () => {
      const locale = 'fr';
      if (isValidLocale(locale)) {
        // TypeScript should accept this
        const typedLocale: Locale = locale;
        expect(typedLocale).toBe('fr');
      }
    });
  });
});
```

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/i18n-config.spec.ts

# Run in watch mode
pnpm test:unit --watch
```

---

## 🔗 Message Structure Tests

### Test File: `tests/unit/i18n-messages.spec.ts`

```typescript
import { describe, it, expect } from 'vitest';
import frMessages from '../../messages/fr.json';
import enMessages from '../../messages/en.json';

describe('i18n messages', () => {
  describe('structure consistency', () => {
    it('should have same top-level keys', () => {
      const frKeys = Object.keys(frMessages).sort();
      const enKeys = Object.keys(enMessages).sort();
      expect(frKeys).toEqual(enKeys);
    });

    it('should have same nested keys in common', () => {
      const frCommonKeys = Object.keys(frMessages.common).sort();
      const enCommonKeys = Object.keys(enMessages.common).sort();
      expect(frCommonKeys).toEqual(enCommonKeys);
    });

    it('should have same nested keys in navigation', () => {
      const frNavKeys = Object.keys(frMessages.navigation).sort();
      const enNavKeys = Object.keys(enMessages.navigation).sort();
      expect(frNavKeys).toEqual(enNavKeys);
    });

    it('should have same nested keys in metadata', () => {
      const frMetaKeys = Object.keys(frMessages.metadata).sort();
      const enMetaKeys = Object.keys(enMessages.metadata).sort();
      expect(frMetaKeys).toEqual(enMetaKeys);
    });

    it('should have same nested keys in accessibility', () => {
      const frA11yKeys = Object.keys(frMessages.accessibility).sort();
      const enA11yKeys = Object.keys(enMessages.accessibility).sort();
      expect(frA11yKeys).toEqual(enA11yKeys);
    });
  });

  describe('content validity', () => {
    it('should have non-empty values in French', () => {
      Object.values(frMessages.common).forEach((value) => {
        expect(value).toBeTruthy();
        expect(typeof value).toBe('string');
      });
    });

    it('should have non-empty values in English', () => {
      Object.values(enMessages.common).forEach((value) => {
        expect(value).toBeTruthy();
        expect(typeof value).toBe('string');
      });
    });

    it('should not have placeholder text', () => {
      const allFrValues = JSON.stringify(frMessages);
      const allEnValues = JSON.stringify(enMessages);

      expect(allFrValues).not.toContain('TODO');
      expect(allFrValues).not.toContain('FIXME');
      expect(allEnValues).not.toContain('TODO');
      expect(allEnValues).not.toContain('FIXME');
    });
  });
});
```

---

## 📊 Coverage Report

Phase 1 does not have a coverage target. Configuration files are validated through TypeScript compilation.

If optional unit tests are added:

```bash
# Generate coverage report
pnpm test:unit --coverage

# View coverage
cat coverage/coverage-summary.json
```

### Coverage Goals (if tests added)

| Area | Target | Priority |
|------|--------|----------|
| `src/i18n/config.ts` | >80% | Low |
| `messages/*.json` | Structure validated | Medium |
| Overall | N/A | - |

---

## 🐛 Debugging Tests

### Common Issues

#### Issue: Tests fail due to import resolution

**Symptom**: `Cannot find module '@/i18n/config'`

**Solutions**:
1. Ensure `vitest.config.mts` has path aliases configured
2. Check `vite-tsconfig-paths` plugin is enabled
3. Verify `tsconfig.json` paths are correct

#### Issue: JSON import fails in tests

**Symptom**: `SyntaxError: Unexpected token` when importing JSON

**Solutions**:
1. Ensure `resolveJsonModule: true` in tsconfig
2. Check JSON file is valid
3. Use correct import syntax: `import fr from '../../messages/fr.json'`

### Debug Commands

```bash
# Run single test in verbose mode
pnpm test:unit tests/unit/i18n-config.spec.ts --reporter=verbose

# Run with debugger
node --inspect-brk ./node_modules/.bin/vitest run tests/unit/i18n-config.spec.ts
```

---

## 🤖 CI/CD Integration

Phase 1 validation runs in the Quality Gate workflow:

```yaml
# From .github/workflows/quality-gate.yml
- name: TypeScript Check
  run: pnpm exec tsc --noEmit

- name: Lint
  run: pnpm lint
```

### Required Checks

All PRs must:

- [x] Pass TypeScript compilation
- [x] Pass linting
- [ ] Pass unit tests (optional for Phase 1)

---

## ✅ Testing Checklist

Before completing Phase 1:

- [ ] TypeScript compiles without errors
- [ ] Linter passes without errors
- [ ] JSON files parse successfully
- [ ] Message structure is consistent (FR = EN keys)
- [ ] Optional: Unit tests pass (if added)

---

## 📝 Best Practices

### Writing Configuration Tests

✅ **Do**:
- Test structure consistency between locales
- Test type narrowing functions
- Test edge cases (invalid locales)

❌ **Don't**:
- Test next-intl library internals
- Test TypeScript types at runtime
- Test translation content quality (manual review)

### Test Naming

Use descriptive, nested describe blocks:

```typescript
describe('i18n configuration', () => {
  describe('locales', () => {
    it('should contain French and English', () => {});
  });
});
```

---

## ❓ FAQ

**Q: Why no unit tests by default?**
A: Phase 1 is configuration-only. TypeScript compilation validates types, and linting validates code quality. Full E2E tests come in Phase 4.

**Q: Should I test message translations?**
A: No. Translation quality is reviewed manually. Tests validate structure only.

**Q: How much should I test?**
A: Minimal for Phase 1. Focus on validating structure and type safety.

**Q: Can I skip validation?**
A: No. TypeScript and lint validation are mandatory before each commit.
