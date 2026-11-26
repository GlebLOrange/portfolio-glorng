---
name: agent-workflow
description: >-
  Branches off main before edits, blocks unrequested commits/pushes/secrets/destructive
  git, checks existing packages before new imports, and asks before running tests. Use
  when editing tracked files, committing, pushing, adding an import, or deciding whether
  to run tests.
---

# Local Git workflow

All AI code work stays in the current local checkout. Cloud/remote agent execution and repository uploads are prohibited.

Before each implementation task, create a fresh `ai/<short-kebab>` branch and use `/task-loop` to delegate Manager → Developer. Never reuse a previous task branch. If branch creation cannot proceed safely, stop and report the blocker.

Do not commit, push, open/edit/merge PRs, or clean up branches/worktrees unless the user explicitly requests that exact action. Read-only Git inspection is allowed. Never add follow-on Git mutations beyond the explicit request.

## Safety

- Never commit unless the user explicitly requests it.
- Never push to `main` unless the user explicitly requests it.
- Never run destructive or irreversible git commands (force push, hard reset, or branch deletion outside the local cleanup above) unless explicitly requested.
- Never delete config, migrations, index scripts, or env files without explicit user confirmation.
- Never commit `.env`, credentials, or other secret-bearing files.

## Dependencies

Before adding an import or dependency:

1. Check `server/pyproject.toml` or `client/package.json` for an existing entry.
2. Verify with `uv pip show <pkg>` (Python) or `npm list <pkg>` (Node) when unsure.

Do not invent package names, modules, or APIs.

## Tests

- Do **not** run unit/integration/E2E tests by default during implementation.
- When implementation for the current ask is done (or before claiming “tests pass”), ask once: **“Run tests for this change?”**
- Run tests only if the user says yes, already asked to run/pass/verify tests, or the task is explicitly test-focused (writing/fixing tests, CI failure).
- Prefer targeted files when they opt in; full suite only if they ask for it.
- Never claim tests passed if none were run.
