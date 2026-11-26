# Workspace context

Load **Active task** only at session start (or when resuming). Load **Durable project facts** only when the task needs them. Never dump this whole file plus transcripts into the prompt.

## Active task
- Goal: Merge cleaned `dev` into `main` via PR 963
- Branch: main @ f370d792 (synced to origin/main)
- Relevant files: qqq.cfg (removed), .wt/ (gitlinks removed), .github/workflows/groq-review.yml (removed)
- Decisions: Junk stripped on `dev` via #964 first; #963 squash-merged (merge commits disabled)
- Open questions: none
- Next action: none — #963 merged; local main matches origin
- Test command:
- Key symbols:
- TODOs: none
- Summary: Dropped accidental files on `dev`, then landed `dev` on `main` as Dev (#963)

## Durable project facts
- Architecture:
- Conventions:
- Known pitfalls: `main` rulesets require checks `gitleaks` and `dev-source-branch`; those Actions workflows can be `disabled_manually` and then block merges. Repo has `allow_merge_commit: false` (squash/rebase only).
