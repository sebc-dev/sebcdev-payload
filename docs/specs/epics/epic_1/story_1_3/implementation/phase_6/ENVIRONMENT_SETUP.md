# Environment Setup - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Purpose**: Configure local environment for development and testing

---

## Prerequisites

### Required Tools

| Tool    | Required Version        | Check Command    | Install Command        |
| ------- | ----------------------- | ---------------- | ---------------------- |
| Node.js | >= 18.20.2 or >= 20.9.0 | `node --version` | Use nvm or volta       |
| pnpm    | >= 9.0.0                | `pnpm --version` | `npm install -g pnpm`  |
| Git     | >= 2.30.0               | `git --version`  | System package manager |

### Verify Prerequisites

```bash
# Check all prerequisites at once
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "Git: $(git --version)"
```

Expected output:

```
Node.js: v20.x.x (or v18.20.x)
pnpm: 9.x.x
Git: git version 2.x.x
```

---

## Project Setup

### 1. Clone and Navigate

```bash
# If not already cloned
git clone <repository-url>
cd sebcdev-payload

# Switch to correct branch
git checkout story_1_3
git pull origin story_1_3
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Verify Build Works

```bash
pnpm build
```

---

## Phase-Specific Setup

### dependency-cruiser Installation

This phase will add dependency-cruiser as a dev dependency. No pre-installation is required.

After Commit 1, you will have:

```bash
# Verify dependency-cruiser is installed
pnpm exec depcruise --version

# Expected output: 16.x.x or higher
```

### Configuration Files

After this phase, the following files will exist:

| File                                        | Purpose                          |
| ------------------------------------------- | -------------------------------- |
| `.dependency-cruiser.cjs`                   | Architecture rules configuration |
| `.dependency-cruiser-known-violations.json` | Baseline (if violations exist)   |

---

## Local Development Workflow

### Running Architecture Validation

```bash
# Quick validation (text output)
pnpm depcruise

# Detailed validation (shows all info)
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long

# Generate visual HTML report
pnpm depcruise:report
# Then open: depcruise-report.html in browser
```

### Understanding Output

#### Clean Output (No Violations)

```
✔ no dependency violations found (X modules, Y dependencies cruised)
```

#### Violations Found

```
error no-circular: src/a.ts → src/b.ts → src/a.ts

  1 dependency violations (1 errors, 0 warnings). X modules, Y dependencies cruised.
```

### Visualizing Dependencies

Generate an HTML report for visual exploration:

```bash
pnpm depcruise:report
open depcruise-report.html  # macOS
xdg-open depcruise-report.html  # Linux
start depcruise-report.html  # Windows
```

The report shows:

- Interactive dependency graph
- Module relationships
- Violation highlights
- Filtering options

---

## IDE Setup

### VS Code Extensions (Recommended)

No specific extensions are required for dependency-cruiser, but these help:

| Extension | Purpose                           |
| --------- | --------------------------------- |
| ESLint    | Code quality (already configured) |
| Prettier  | Formatting (already configured)   |

### Configuration Validation

The `.dependency-cruiser.cjs` file uses JSDoc for type hints:

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  // Your IDE should provide autocomplete here
}
```

---

## Troubleshooting

### Issue: "Cannot find module 'typescript'"

**Cause**: dependency-cruiser needs TypeScript to parse `.ts` files

**Solution**: TypeScript should already be installed as a devDependency

```bash
pnpm add -D typescript  # If missing
```

### Issue: "Could not find tsconfig.json"

**Cause**: Config file path is incorrect

**Solution**: Verify the path in `.dependency-cruiser.cjs`:

```javascript
tsConfig: {
  fileName: 'tsconfig.json',  // Relative to project root
}
```

### Issue: Very slow analysis

**Cause**: Analyzing too many files (including node_modules)

**Solution**: Ensure exclusions are configured:

```javascript
options: {
  doNotFollow: {
    path: 'node_modules',
  },
  exclude: {
    path: ['node_modules', '.next', '.open-next'],
  },
}
```

### Issue: False positives on Next.js conventions

**Cause**: dependency-cruiser doesn't understand Next.js file conventions

**Solution**: Add exclusions for convention-based files:

```javascript
from: {
  pathNot: [
    'page\\.tsx$',
    'layout\\.tsx$',
    'loading\\.tsx$',
  ],
}
```

---

## Testing the Setup

### Quick Smoke Test

```bash
# 1. Verify depcruise runs
pnpm depcruise

# 2. Check output format
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long

# 3. Generate report (should create HTML file)
pnpm depcruise:report
ls -la depcruise-report.html
```

### Validate Configuration

```bash
# Check config file syntax
node -e "require('./.dependency-cruiser.cjs')" && echo "Config is valid"
```

### Test with Intentional Violation

Create a temporary circular dependency to verify detection:

```bash
# Create test files (DO NOT COMMIT)
echo "import './test-b'" > src/test-a.ts
echo "import './test-a'" > src/test-b.ts

# Run analysis - should detect circular dependency
pnpm depcruise

# Clean up
rm src/test-a.ts src/test-b.ts
```

---

## Environment Variables

This phase does not require any environment variables.

The CI workflow uses:

| Variable              | Context | Purpose              |
| --------------------- | ------- | -------------------- |
| `GITHUB_STEP_SUMMARY` | CI only | Write to job summary |

---

## Checklist Before Starting

- [ ] Node.js >= 18.20.2 or >= 20.9.0 installed
- [ ] pnpm >= 9.0.0 installed
- [ ] On correct branch (`story_1_3`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Build passes (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)

---

## Quick Reference Card

| Task            | Command                                                                           |
| --------------- | --------------------------------------------------------------------------------- |
| Run validation  | `pnpm depcruise`                                                                  |
| Generate report | `pnpm depcruise:report`                                                           |
| Check version   | `pnpm exec depcruise --version`                                                   |
| Verbose output  | `pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long` |
| JSON output     | `pnpm exec depcruise src --output-type json`                                      |
| Validate config | `node -e "require('./.dependency-cruiser.cjs')"`                                  |

---

**Setup Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
