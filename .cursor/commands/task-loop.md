# Task loop (Manager → Developer)

Required implementation workflow. All coding and tools stay in the current local checkout; do not use cloud/remote agents, remote workspaces, or upload source.

```text
$ARGUMENTS
```

If empty, ask once for the task text and stop.

For every implementation task, the parent creates a fresh `ai/<slug>` branch from current HEAD, even when already on an `ai/*` branch. Never reuse an existing branch; stop if the chosen name exists. Do not commit, push, or perform PR actions unless the user explicitly requests that exact action.

## 1 — Manager (Assign)

Spawn `manager` with:

```text
Mode: Assign (task-loop).
User request:
<paste $ARGUMENTS>

Do not modify files, spawn personas, or write a task file.
Use Gortex per .cursor/rules/gortex-workflow.mdc.
Emit exactly one TASK yaml that passes .cursor/agents/README.md requirement bar, then stop.
```

Wait for TASK yaml. If recommendations instead, ask once for Assign-mode yaml only; else stop and show what Manager returned.

## 2 — Branch

Create a fresh `ai/<slug>` branch from current HEAD using `branch_hint` (or a short kebab); stop if that branch name already exists.

## 3 — Developer

Spawn `developer` with the TASK yaml plus:

```text
Implement this TASK from /task-loop.
- Stay on the fresh `ai/<slug>` branch created by the parent.
- Read CODING_STANDARDS.md before app edits; stay in scope.
- Gortex: .cursor/rules/gortex-workflow.mdc.
- Run only TASK `checks:`; empty checks → SKIPPED (empty checks).
- Do not commit, push, or open a PR unless the user explicitly requests that exact action.
- Return the developer evidence block (requirement-bar one-liner included).
```

Wait for evidence, then stop.

## Final message

```text
## Task-loop result
- Branch: …
- TASK: …
- Requirement bar: …
- Changed: …
- Checks: …
- Next: you commit / open PR / merge when ready
```
