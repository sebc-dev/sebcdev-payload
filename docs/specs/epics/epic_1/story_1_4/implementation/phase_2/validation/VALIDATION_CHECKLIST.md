# Phase 2: Validation Checklist - Deployment Workflow Creation

Complete this checklist after implementing all commits to validate Phase 2 completion.

---

## Pre-Validation Requirements

Before starting validation, ensure:

- [ ] All 4 commits are implemented and pushed
- [ ] PR is created (if not already merged)
- [ ] No pending review comments

---

## 1. Workflow Structure Validation

### 1.1 Deploy Job Configuration

| Check       | Expected                                                                            | Actual | Status |
| ----------- | ----------------------------------------------------------------------------------- | ------ | ------ |
| Job exists  | `deploy:` job in workflow                                                           |        | [ ]    |
| Job name    | "Deploy to Cloudflare"                                                              |        | [ ]    |
| Dependency  | `needs: [quality-gate]`                                                             |        | [ ]    |
| Conditional | `if: github.ref == 'refs/heads/main' \|\| github.event_name == 'workflow_dispatch'` |        | [ ]    |
| Runner      | `ubuntu-latest`                                                                     |        | [ ]    |

### 1.2 Permissions

| Check                  | Expected         | Actual | Status |
| ---------------------- | ---------------- | ------ | ------ |
| Deploy job permissions | `contents: read` |        | [ ]    |
| No write permissions   | Only read access |        | [ ]    |

### 1.3 SHA Pinning

All actions must be SHA-pinned:

| Action                     | Version | SHA Present | Status |
| -------------------------- | ------- | ----------- | ------ |
| actions/checkout           | v6.0.0  | [ ]         | [ ]    |
| pnpm/action-setup          | v4.2.0  | [ ]         | [ ]    |
| actions/setup-node         | v6.0.0  | [ ]         | [ ]    |
| cloudflare/wrangler-action | v3.x    | [ ]         | [ ]    |

---

## 2. Functionality Validation

### 2.1 Job Dependency

Verify deploy job waits for quality-gate:

**Test Method**: Trigger workflow on a branch with failing quality-gate

| Scenario            | Expected Result       | Actual | Status |
| ------------------- | --------------------- | ------ | ------ |
| Quality gate fails  | Deploy job is skipped |        | [ ]    |
| Quality gate passes | Deploy job runs       |        | [ ]    |

### 2.2 D1 Migrations

Verify migrations execute correctly:

**Test Method**: Check workflow logs for migration step

| Check            | Expected                | Actual | Status |
| ---------------- | ----------------------- | ------ | ------ |
| Step name        | "Run D1 Migrations"     |        | [ ]    |
| Log grouping     | `::group::` used        |        | [ ]    |
| Success notice   | `::notice::` on success |        | [ ]    |
| Environment vars | All secrets present     |        | [ ]    |

### 2.3 Wrangler Deployment

Verify deployment executes correctly:

**Test Method**: Check workflow logs and outputs

| Check             | Expected                       | Actual | Status |
| ----------------- | ------------------------------ | ------ | ------ |
| Step name         | "Deploy to Cloudflare Workers" |        | [ ]    |
| Step ID           | `id: deploy`                   |        | [ ]    |
| Deployment output | URL in `deployment-url`        |        | [ ]    |
| GitHub Summary    | Deployment info present        |        | [ ]    |

### 2.4 Deployment Validation

Verify post-deployment validation:

**Test Method**: Check workflow logs

| Check               | Expected                    | Actual | Status |
| ------------------- | --------------------------- | ------ | ------ |
| Wait-for-URL        | Polls until site accessible |        | [ ]    |
| Success notice      | `::notice::` when live      |        | [ ]    |
| Smoke test homepage | Tests / endpoint            |        | [ ]    |
| Smoke test admin    | Tests /admin endpoint       |        | [ ]    |
| Log grouping        | Groups for each test        |        | [ ]    |

---

## 3. Deployment Validation

### 3.1 Site Accessibility

After successful deployment, verify site is accessible:

```bash
# Replace with actual deployment URL
URL="https://your-deployment-url"

# Test homepage
curl -s -o /dev/null -w "%{http_code}" "$URL"
# Expected: 200

# Test admin
curl -s -o /dev/null -w "%{http_code}" "$URL/admin"
# Expected: 200 or 302
```

| Endpoint | Expected Status | Actual | Status |
| -------- | --------------- | ------ | ------ |
| /        | 200             |        | [ ]    |
| /admin   | 200 or 302      |        | [ ]    |

### 3.2 GitHub Summary

Verify the deployment summary contains:

| Element         | Present | Status |
| --------------- | ------- | ------ |
| Deployment URL  | [ ]     | [ ]    |
| Commit SHA      | [ ]     | [ ]    |
| Success message | [ ]     | [ ]    |

---

## 4. Security Validation

### 4.1 No Secret Exposure

Review workflow logs for any secret leakage:

| Check                       | Verified | Status |
| --------------------------- | -------- | ------ |
| No API token in logs        | [ ]      | [ ]    |
| No account ID in plain text | [ ]      | [ ]    |
| No PAYLOAD_SECRET in logs   | [ ]      | [ ]    |

### 4.2 Secrets Configuration

Verify secrets are properly configured:

| Secret                | Exists in Settings | Used in Workflow | Status |
| --------------------- | ------------------ | ---------------- | ------ |
| CLOUDFLARE_API_TOKEN  | [ ]                | [ ]              | [ ]    |
| CLOUDFLARE_ACCOUNT_ID | [ ]                | [ ]              | [ ]    |
| PAYLOAD_SECRET        | [ ]                | [ ]              | [ ]    |

---

## 5. Documentation Validation

### 5.1 DEPLOYMENT.md Exists

| Check                                    | Present | Status |
| ---------------------------------------- | ------- | ------ |
| File exists at docs/guides/DEPLOYMENT.md | [ ]     | [ ]    |

### 5.2 Documentation Completeness

| Section               | Present | Accurate | Status |
| --------------------- | ------- | -------- | ------ |
| Overview              | [ ]     | [ ]      | [ ]    |
| Deployment Pipeline   | [ ]     | [ ]      | [ ]    |
| Trigger Conditions    | [ ]     | [ ]      | [ ]    |
| Required Secrets      | [ ]     | [ ]      | [ ]    |
| API Token Permissions | [ ]     | [ ]      | [ ]    |
| Deployment Process    | [ ]     | [ ]      | [ ]    |
| Manual Deployment     | [ ]     | [ ]      | [ ]    |
| Monitoring            | [ ]     | [ ]      | [ ]    |
| Troubleshooting       | [ ]     | [ ]      | [ ]    |
| Rollback              | [ ]     | [ ]      | [ ]    |

### 5.3 Documentation Accuracy

Test documented commands:

```bash
# Manual deployment commands
pnpm payload migrate  # Should work
pnpm exec wrangler deploy  # Should work
pnpm exec wrangler deployments list  # Should work
```

| Command                             | Works | Status |
| ----------------------------------- | ----- | ------ |
| pnpm payload migrate                | [ ]   | [ ]    |
| pnpm exec wrangler deploy           | [ ]   | [ ]    |
| pnpm exec wrangler deployments list | [ ]   | [ ]    |

---

## 6. Integration Validation

### 6.1 Full Pipeline Test

Run a complete pipeline from PR to deployment:

1. Create PR with small change
2. Trigger Quality Gate manually
3. Wait for all jobs to complete
4. Verify deployment

| Step                 | Passed | Status |
| -------------------- | ------ | ------ |
| Quality Gate passes  | [ ]    | [ ]    |
| Deploy job waits     | [ ]    | [ ]    |
| Migrations run       | [ ]    | [ ]    |
| Deployment completes | [ ]    | [ ]    |
| Validation passes    | [ ]    | [ ]    |
| Site accessible      | [ ]    | [ ]    |

### 6.2 Conditional Execution

Verify deployment only runs in correct scenarios:

| Scenario                     | Deploy Runs | Status |
| ---------------------------- | ----------- | ------ |
| PR to main (manual dispatch) | Yes         | [ ]    |
| Push to main                 | Yes         | [ ]    |
| PR without dispatch          | No          | [ ]    |

---

## 7. Performance Validation

### 7.1 Timing

Record actual execution times:

| Step             | Target | Actual | Status |
| ---------------- | ------ | ------ | ------ |
| D1 Migrations    | < 60s  |        | [ ]    |
| Wrangler Deploy  | < 120s |        | [ ]    |
| Wait-for-URL     | < 60s  |        | [ ]    |
| Smoke Tests      | < 30s  |        | [ ]    |
| Total Deploy Job | < 5min |        | [ ]    |

---

## 8. Acceptance Criteria Validation

### Story 1.4 CA2: Deployment Workflow Integration

| Criterion                              | Met | Evidence                    |
| -------------------------------------- | --- | --------------------------- |
| Deploy workflow exists                 | [ ] | quality-gate.yml updated    |
| Deployment conditioned on quality-gate | [ ] | `needs: [quality-gate]`     |
| Workflow supports manual dispatch      | [ ] | `workflow_dispatch` trigger |
| Environment variables documented       | [ ] | DEPLOYMENT.md               |

### Story 1.4 CA4: Wrangler Deploy Integration

| Criterion                   | Met | Evidence                  |
| --------------------------- | --- | ------------------------- |
| wrangler deploy integrated  | [ ] | Deploy step in workflow   |
| D1 migrations before deploy | [ ] | Migration step runs first |
| Production environment used | [ ] | wrangler.jsonc config     |

### Story 1.4 CA5: Deployment Validation

| Criterion                      | Met | Evidence             |
| ------------------------------ | --- | -------------------- |
| Wait-for-URL implemented       | [ ] | Validation step      |
| Smoke test validates site      | [ ] | Homepage/admin tests |
| Workflow fails on deploy error | [ ] | Exit code handling   |
| URL in GitHub Summary          | [ ] | Step summary output  |

---

## 9. Final Sign-Off

### Implementation Complete

| Item                    | Verified | Signature |
| ----------------------- | -------- | --------- |
| All commits implemented | [ ]      |           |
| All tests pass          | [ ]      |           |
| Documentation complete  | [ ]      |           |
| Security validated      | [ ]      |           |

### Ready for Phase 3

| Prerequisite           | Met | Status |
| ---------------------- | --- | ------ |
| Deploy job functional  | [ ] | [ ]    |
| API Token working      | [ ] | [ ]    |
| Documentation complete | [ ] | [ ]    |

---

## Validation Summary

### Metrics

| Metric              | Target   | Actual |
| ------------------- | -------- | ------ |
| Total commits       | 4        |        |
| Files changed       | ~3       |        |
| Lines added         | ~240     |        |
| Implementation time | 1-2 days |        |
| All checks passing  | Yes      |        |

### Issues Found

| Issue | Severity | Resolution |
| ----- | -------- | ---------- |
|       |          |            |

### Notes

```
Add any notes about the validation process here.
```

---

## Post-Validation Actions

After all validation passes:

1. **Update PHASES_PLAN.md**

   ```markdown
   - [x] Phase 2: Deployment Workflow Creation - Status: Complete, Actual duration: X days
   ```

2. **Update EPIC_TRACKING.md**
   - Mark Phase 2 as complete
   - Update story progress

3. **Prepare for Phase 3**
   - Review Phase 3 documentation
   - Verify Cloudflare OIDC requirements

---

**Validation Checklist Created**: 2025-11-29
**Last Updated**: 2025-11-29
**Validated By**: ********\_********
**Validation Date**: ********\_********
