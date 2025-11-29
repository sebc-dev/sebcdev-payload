# Phase 2: Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Epic**: 1 - Foundation & Cloudflare Architecture
**Phase**: 2 of 8
**Status**: 📋 READY TO IMPLEMENT

---

## Quick Navigation

| Document                                                                   | Purpose                             |
| -------------------------------------------------------------------------- | ----------------------------------- |
| [INDEX.md](./INDEX.md)                                                     | This file - Overview and navigation |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)                         | Detailed atomic commit strategy     |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)                               | Per-commit validation checklists    |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)                             | Environment configuration           |
| [guides/REVIEW.md](./guides/REVIEW.md)                                     | Code review guidelines              |
| [guides/TESTING.md](./guides/TESTING.md)                                   | Testing strategy                    |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist          |

---

## Phase Overview

### Objective

Configure Socket.dev for behavioral analysis of npm dependencies and supply chain attack detection. This phase implements the first layer of the "AI-Shield" defense strategy, protecting against malicious packages, typosquatting, and suspicious installation scripts.

### Why Socket.dev?

Traditional security scanners (SCA tools) rely on known CVE databases - they're **reactive**. Socket.dev is **proactive**: it analyzes what packages actually do (network calls, file access, environment variable reads) to detect malicious behavior before a CVE is published.

**Key Detections:**

- Malware injection via `postinstall` scripts
- Typosquatting attacks (`react-dom` vs `raect-dom`)
- Environment variable exfiltration
- Obfuscated code and unusual dependencies
- Untrusted publishers and sudden maintainer changes

### Scope

**In Scope:**

- Socket.dev GitHub App integration
- `socket.yml` configuration file (v2)
- Security policy configuration (BLOCK/WARN/MONITOR)
- License policy (deny list for viral licenses)
- Workflow integration (Step in quality-gate.yml)
- Documentation of `@SocketSecurity ignore` mechanism

**Out of Scope:**

- OIDC authentication (Phase 2 of ENF6, different story)
- Other quality checks (ESLint, Knip - future phases)

### Dependencies

| Dependency                   | Status   | Impact                     |
| ---------------------------- | -------- | -------------------------- |
| Phase 1: Workflow Foundation | Required | Must have quality-gate.yml |
| Socket.dev Account           | Required | Free tier available        |
| GitHub App Installation      | Required | One-time setup             |

### Success Criteria

- [ ] Socket.dev scans all dependencies on workflow run
- [ ] No blocking alerts on current clean codebase
- [ ] License policy enforced (GPL/AGPL blocked)
- [ ] `@SocketSecurity ignore` mechanism documented and functional
- [ ] Workflow execution time < 30 seconds for Socket step

---

## Commit Structure

This phase consists of **4 atomic commits**:

| Commit | Description                             | Files              | Complexity |
| ------ | --------------------------------------- | ------------------ | ---------- |
| 1      | Create socket.yml configuration         | `socket.yml`       | Low        |
| 2      | Add Socket.dev step to workflow         | `quality-gate.yml` | Low        |
| 3      | Configure security and license policies | `socket.yml`       | Medium     |
| 4      | Document Socket.dev workflow            | `docs/`            | Low        |

**Total Estimated Duration:** 1-2 days
**Total Lines Changed:** ~100-150 lines

---

## Technical Context

### Socket.dev Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Pull Request                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Socket.dev GitHub Action                    │
│  - Downloads Socket CLI                                  │
│  - Analyzes package.json and pnpm-lock.yaml             │
│  - Compares against behavioral database                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  socket.yml Config                       │
│  - issueRules: Enable/disable specific checks           │
│  - projectIgnorePaths: Exclude test fixtures            │
│  - triggerPaths: Only scan when deps change             │
│  - licensePolicies: Block viral licenses                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Security Decision                        │
│  BLOCK → Fail workflow (malware, typosquatting)         │
│  WARN  → Continue with warning (telemetry, native code) │
│  MONITOR → Log only (unmaintained packages)             │
└─────────────────────────────────────────────────────────┘
```

### Security Policy Matrix

| Threat Category       | Action           | Rationale                            |
| --------------------- | ---------------- | ------------------------------------ |
| **Malware Known**     | BLOCK            | Existential risk                     |
| **Typosquatting**     | BLOCK            | Almost always an attack              |
| **Install Scripts**   | BLOCK (Frontend) | 90%+ of npm malware vector           |
| **Telemetry**         | WARN             | Privacy concern, human review needed |
| **Native Code**       | WARN             | Often legitimate (esbuild, fsevents) |
| **Unmaintained**      | MONITOR          | Tech debt, not active threat         |
| **GPL/AGPL Licenses** | BLOCK            | Legal compliance                     |

---

## Risk Assessment

### Identified Risks

| Risk                               | Likelihood | Impact | Mitigation                                  |
| ---------------------------------- | ---------- | ------ | ------------------------------------------- |
| False positives on legitimate deps | Medium     | High   | Configure `@SocketSecurity ignore` workflow |
| Socket.dev service unavailable     | Low        | Medium | Non-blocking workflow (continue-on-error)   |
| Long scan time on large lockfile   | Low        | Low    | Use cache, configure triggerPaths           |

### Contingency Plans

1. **False Positive Blocking PR**
   - Developer posts: `@SocketSecurity ignore <package>@<version>`
   - Document in PR why it's acceptable
   - Consider adding to project-level ignore

2. **Service Outage**
   - Workflow configured with `continue-on-error: true`
   - Manual security review before merge

---

## Reference Documents

### Internal Documentation

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Story phase overview
- [CI-CD-Security.md](../../../../../CI-CD-Security.md) - Section 2.1
- [socket-dev-CI.md](../../../../../../tech/github/socket-dev-CI.md) - Detailed Socket.dev guide

### External Resources

- [Socket.dev Documentation](https://docs.socket.dev/)
- [Socket.dev GitHub Action](https://github.com/SocketDev/action)
- [socket.yml Configuration](https://docs.socket.dev/docs/socket-yml)

---

## Quick Start Commands

```bash
# Navigate to phase documentation
cd docs/specs/epics/epic_1/story_1_3/implementation/phase_2

# Read implementation plan
cat IMPLEMENTATION_PLAN.md

# Follow commit checklist
cat COMMIT_CHECKLIST.md

# After implementation, validate
cat validation/VALIDATION_CHECKLIST.md
```

---

## Phase Execution Workflow

```
1. Read IMPLEMENTATION_PLAN.md
   └─→ Understand commit strategy

2. For each commit (1-4):
   ├─→ Read COMMIT_CHECKLIST.md section
   ├─→ Implement changes
   ├─→ Run local validation
   ├─→ Commit with specified message
   └─→ Verify post-commit checks

3. After all commits:
   ├─→ Push to GitHub
   ├─→ Trigger Quality Gate workflow
   ├─→ Verify Socket.dev scan passes
   └─→ Complete validation/VALIDATION_CHECKLIST.md

4. Phase Complete
   └─→ Update EPIC_TRACKING.md
```

---

**Phase 2 Documentation Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created By**: Claude Code (phase-doc-generator)
