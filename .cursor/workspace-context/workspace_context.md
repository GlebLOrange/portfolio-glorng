# Workspace context

Load **Active task** only at session start (or when resuming). Load **Durable project facts** only when the task needs them. Never dump this whole file plus transcripts into the prompt.

## Active task
- Goal: Restore Gortex MCP tools for this checkout
- Branch: ai/docs-repo-roles
- Relevant files: .agents/mcp_config.json, .cursor/mcp.json.example
- Decisions: Absolute checkout path in gortex mcp --proxy --index and CURSOR_WORKSPACE
- Open questions: none
- Next action: Reload Gortex in Cursor MCP settings, then a new chat
- Test command:
- Key symbols: CURSOR_WORKSPACE
- TODOs: Reload MCP; do not commit unless asked
- Summary: Index was healthy; tools were missing because MCP started without a workspace path

## Durable project facts
- Architecture:
- Conventions:
- Known pitfalls:
