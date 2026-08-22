---
name: release-mod
description: Prepare, verify, and package a Factorio mod release, including version sync, changelog formatting, build verification, zip packaging, and git tag conventions.
---

# Factorio Mod Release Workflow

## Pre-Release Checklist

Before releasing, execute the following validation steps:

### 1. Synchronize Version Numbers

Ensure the target version (e.g. `1.0.2` or `2.1.5`) is identical across all configuration files of the mod:

- `<mod_folder>/package.json` → `"version": "X.Y.Z"`
- `<mod_folder>/static/info.json` → `"version": "X.Y.Z"`

### 2. Format `static/changelog.txt`

Factorio requires a strict changelog format. Ensure the top section has:

```text
----------------------------------------------------------------------------------------------------
Version: X.Y.Z
Date: YYYY-MM-DD
  Features:
    - Description of new feature.
  Bugfixes:
    - Description of bug fix.
  Refactoring:
    - Description of refactoring.
```

### 3. Verify Clean Build & Type-Check

Run the build script in the target mod folder:

```bash
cd <mod_folder>
npm run build
```

Verify that:

1. `npm run format` and `npm run lint` pass without errors.
2. TSTL compiles to `dist/` with 0 errors.

---

## Zip Packaging & Verification

Run the release packaging script:

```bash
cd <mod_folder>
npm run release
```
