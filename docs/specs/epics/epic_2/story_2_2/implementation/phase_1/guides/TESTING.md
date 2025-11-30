# Testing Guide - Phase 1 : Media Collection Enhancement

## Overview

Ce guide decrit la strategie de tests pour la Phase 1.
Note : Cette phase se concentre sur les **tests manuels** car les tests automatises R2 seront implementes en Phase 2.

---

## Testing Strategy

### Test Pyramid for Phase 1

```
         /\
        /  \
       / E2E \       <- Phase 3 (future)
      /------\
     /  INT   \      <- Phase 2 (future)
    /----------\
   /  MANUAL    \    <- Phase 1 (this phase)
  /--------------\
```

### Phase 1 Focus

| Test Type       | Coverage | Reason                              |
| --------------- | -------- | ----------------------------------- |
| Manual Testing  | Primary  | Validate collection configuration   |
| Unit Tests      | None     | No custom logic to unit test        |
| Integration     | Phase 2  | R2 integration tests later          |
| E2E             | Phase 3  | Full workflow tests later           |

---

## Manual Test Plan

### Test Environment Setup

```bash
# Start development server
pnpm dev

# Access admin panel
open http://localhost:3000/admin

# Login with admin credentials
```

---

## Test Case 1 : Field Visibility

### Objective

Verifier que le nouveau champ `caption` apparait dans le formulaire admin.

### Steps

1. Naviguer vers `/admin/collections/media/create`
2. Observer le formulaire de creation

### Expected Results

| Check                         | Expected                              |
| ----------------------------- | ------------------------------------- |
| Field `alt` visible           | Yes, text input required              |
| Field `caption` visible       | Yes, textarea input optional          |
| Caption description visible   | "Optional caption displayed below..." |
| Upload zone visible           | Yes, drag & drop area                 |

### Pass/Fail

- [ ] PASS : Tous les champs visibles et corrects
- [ ] FAIL : Champ manquant ou mal configure

---

## Test Case 2 : Valid Image Upload

### Objective

Verifier qu'une image valide (JPEG) peut etre uploadee avec succes.

### Prerequisites

- Fichier test : `test-image.jpg` (< 10 MB)
- Alt text prepare : "Test image description"
- Caption prepare : "Optional caption for test"

### Steps

1. Naviguer vers `/admin/collections/media/create`
2. Drag & drop `test-image.jpg` dans la zone upload
3. Remplir `alt` : "Test image description"
4. Remplir `caption` : "Optional caption for test"
5. Cliquer "Save"

### Expected Results

| Check                         | Expected                              |
| ----------------------------- | ------------------------------------- |
| Upload progress               | Progress bar visible                  |
| Upload completes              | No error message                      |
| Redirect to list              | `/admin/collections/media`            |
| Image in list                 | Thumbnail visible                     |
| Alt text saved                | "Test image description"              |
| Caption saved                 | "Optional caption for test"           |

### Console Logs Check

```bash
# Dans les logs du serveur, verifier :
# Media uploaded successfully
# mediaId: xxx
# filename: test-image.jpg
# mimeType: image/jpeg
# filesize: xxx
```

### Pass/Fail

- [ ] PASS : Upload reussi, logs visibles
- [ ] FAIL : Erreur ou logs manquants

---

## Test Case 3 : MIME Type Validation

### Objective

Verifier que les types MIME non autorises sont rejetes.

### Test Files Needed

| File                | MIME Type         | Expected Result |
| ------------------- | ----------------- | --------------- |
| `test.jpg`          | `image/jpeg`      | Accepted        |
| `test.png`          | `image/png`       | Accepted        |
| `test.webp`         | `image/webp`      | Accepted        |
| `test.gif`          | `image/gif`       | Accepted        |
| `test.svg`          | `image/svg+xml`   | Accepted        |
| `test.pdf`          | `application/pdf` | Rejected        |
| `test.txt`          | `text/plain`      | Rejected        |
| `test.exe`          | `application/*`   | Rejected        |

### Steps (for each file)

1. Naviguer vers `/admin/collections/media/create`
2. Tenter d'uploader le fichier
3. Observer le resultat

### Expected Results for Rejected Files

| Check                         | Expected                              |
| ----------------------------- | ------------------------------------- |
| Error message                 | MIME type validation error            |
| Upload blocked                | File not saved                        |
| No server error               | Clean rejection, no crash             |

### Pass/Fail

- [ ] PASS : Types valides acceptes, invalides rejetes
- [ ] FAIL : Type invalide accepte ou valide rejete

---

## Test Case 4 : File Size Validation

### Objective

Verifier que les fichiers > 10 MB sont rejetes.

### Test Files Needed

| File Size    | Expected Result |
| ------------ | --------------- |
| 1 MB         | Accepted        |
| 5 MB         | Accepted        |
| 9.9 MB       | Accepted        |
| 10.1 MB      | Rejected        |
| 15 MB        | Rejected        |

### Creating Test Files

```bash
# Create a 15 MB test file (for rejection test)
dd if=/dev/zero of=large-test.jpg bs=1M count=15

# Note: This creates a corrupted JPEG, but size validation
# should happen before content validation
```

### Steps

1. Naviguer vers `/admin/collections/media/create`
2. Tenter d'uploader le fichier volumineux
3. Observer le resultat

### Expected Results

| Check                         | Expected                              |
| ----------------------------- | ------------------------------------- |
| Error before upload           | Size limit exceeded message           |
| Upload not started            | No progress bar                       |
| Clear error message           | "File exceeds 10MB limit" or similar  |

### Pass/Fail

- [ ] PASS : Fichiers > 10 MB rejetes avec message clair
- [ ] FAIL : Gros fichier accepte ou erreur non claire

---

## Test Case 5 : Hook Logging Verification

### Objective

Verifier que le hook `afterChange` log correctement les uploads.

### Steps

1. Ouvrir le terminal avec les logs server : `pnpm dev`
2. Uploader une image valide
3. Observer les logs

### Expected Log Output

```
[INFO] Media uploaded successfully
  mediaId: "abc123..."
  filename: "test-image.jpg"
  mimeType: "image/jpeg"
  filesize: 1234567
```

### Log Verification Checklist

- [ ] Log niveau `info` (pas `warn` ou `error`)
- [ ] `mediaId` present et non-vide
- [ ] `filename` correspond au fichier uploade
- [ ] `mimeType` correct (`image/jpeg`, etc.)
- [ ] `filesize` est un nombre > 0

### Pass/Fail

- [ ] PASS : Logs structures et complets
- [ ] FAIL : Logs manquants ou incomplets

---

## Test Case 6 : Update Operation (No Log)

### Objective

Verifier que le hook ne log pas lors d'une mise a jour.

### Steps

1. Uploader une image (observer le log)
2. Editer l'image (changer `alt` ou `caption`)
3. Sauvegarder
4. Observer les logs

### Expected Results

| Operation | Log Expected |
| --------- | ------------ |
| Create    | Yes          |
| Update    | No           |

### Pass/Fail

- [ ] PASS : Pas de log lors de l'update
- [ ] FAIL : Log emis lors de l'update

---

## Test Case 7 : Delete Media

### Objective

Verifier que la suppression fonctionne correctement.

### Steps

1. Naviguer vers un media existant
2. Cliquer "Delete"
3. Confirmer la suppression

### Expected Results

| Check                         | Expected                              |
| ----------------------------- | ------------------------------------- |
| Confirmation dialog           | "Are you sure?" or similar            |
| Deletion succeeds             | No error message                      |
| Redirect to list              | `/admin/collections/media`            |
| Media removed from list       | Not visible anymore                   |

### Pass/Fail

- [ ] PASS : Suppression reussie
- [ ] FAIL : Erreur ou media toujours present

---

## Test Results Summary

### Test Execution Record

| Test Case | Date | Tester | Result | Notes |
| --------- | ---- | ------ | ------ | ----- |
| TC1 - Field Visibility | | | [ ] Pass [ ] Fail | |
| TC2 - Valid Upload | | | [ ] Pass [ ] Fail | |
| TC3 - MIME Validation | | | [ ] Pass [ ] Fail | |
| TC4 - Size Validation | | | [ ] Pass [ ] Fail | |
| TC5 - Hook Logging | | | [ ] Pass [ ] Fail | |
| TC6 - Update No Log | | | [ ] Pass [ ] Fail | |
| TC7 - Delete Media | | | [ ] Pass [ ] Fail | |

### Overall Phase 1 Test Status

- [ ] All tests passed - Ready for Phase 2
- [ ] Some tests failed - Fix required before Phase 2

---

## Test Data Cleanup

After testing, clean up test data :

```bash
# Via Admin Panel
# 1. Go to /admin/collections/media
# 2. Select all test media
# 3. Delete

# Local R2 cleanup (if needed)
rm -rf .wrangler/state/r2/*
```

---

## Defect Report Template

If a test fails, document it :

```markdown
### Defect: [Title]

**Test Case**: TC-X
**Severity**: High/Medium/Low
**Date**: YYYY-MM-DD

**Description**:
[What happened]

**Expected**:
[What should have happened]

**Actual**:
[What actually happened]

**Steps to Reproduce**:
1. ...
2. ...

**Screenshots/Logs**:
[Attach if relevant]

**Resolution**:
[ ] Fixed in commit: xxx
[ ] Won't fix: [reason]
```

---

## Transition to Phase 2

Once all manual tests pass :

1. [ ] Document test results in this file
2. [ ] Commit documentation updates
3. [ ] Proceed to Phase 2 for automated integration tests

Phase 2 will implement :
- `tests/int/media-r2.int.spec.ts`
- Automated CRUD tests
- R2 storage verification

---

## References

- [COMMIT_CHECKLIST.md](../COMMIT_CHECKLIST.md) - Implementation checklist
- [validation/VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md) - Final validation
- [Payload Upload Docs](https://payloadcms.com/docs/upload/overview)
