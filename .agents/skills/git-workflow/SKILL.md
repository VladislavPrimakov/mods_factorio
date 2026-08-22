---
name: git-workflow
description: Procedures for git commits, structured monorepo commit messages, atomic commits, squashing intermediate work, and mod release tagging (<mod>/v<version>).
---

# Git Workflow & Commit Standards

Use this skill when preparing commits, squashing history, or tagging releases in this repository.

---

## 📝 Commit Message Structure

### 1. Title Format

The commit title must specify the affected modules/projects (`fcore`, `cybersyn2-combinator`, `website`, etc.):

* **Release / Version Bump Commits:** Always include the version in the title:
  - `fcore v1.0.1, website: modernize style system and update documentation`
  - `cybersyn2-combinator v2.1.4: add bitmask encoder and priority summary`
* **Non-Release Commits:** Omit the version, specify affected parts:
  - `website: fix broken links on mobile sidebar`
  - `fcore: optimize scheduler bucket lookup`

---

### 2. Body Format

Group changes by project, then by category (`feat`, `fix`, `refactor`, `docs`, `chore`):

```text
fcore, website: overhaul style system and update documentation

fcore:
  feat:
    - add open union inference StyleFor<E>
  refactor:
    - flatten ButtonStyles and FrameStyles into direct string literals

website:
  docs:
    - update patterns/styles guide
    - fix base path in hero links
```

---

## 📦 Squashing Commits

Squash intermediate draft commits into a single clean commit before finishing:
```bash
git reset --soft <base_commit>
git commit -m "<title>" -m "<body>"
```

---

## 🏷️ Release Tagging Standards

Tags must always follow `<mod>/v<version>`:

- Examples: `fcore/v1.0.1`, `cybersyn2-combinator/v2.1.4`

```bash
git tag <mod>/v<version>
git push origin master --tags
```

To update a tag after `commit --amend` or squash:
```bash
git tag -f <mod>/v<version>
git push origin master -f --tags
```
