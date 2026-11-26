/**
 * Checked-in AI settings inventory for /admin/page-catalogue.
 * ponytail: static seed of this repo's .cursor / .agents declarations — not a live
 * scanner of ~/.cursor, running MCP sessions, or global plugins. Extend by adding
 * an object below; upgrade path is a small build-time or admin API inventory if
 * machine state ever needs to show up here.
 */

export const AI_CATALOGUE_SECTION_IDS = [
  "skills",
  "personas",
  "mcp",
  "plugins",
  "rules",
] as const;

export type AiCatalogueSectionId = (typeof AI_CATALOGUE_SECTION_IDS)[number];

export type AiCatalogueStatus = "on" | "off" | "error";

export type AiCatalogueItem = {
  id: string;
  section: AiCatalogueSectionId;
  name: string;
  description: string;
  status: AiCatalogueStatus;
  tags?: string[];
  version?: string;
  source?: string;
  /** MCP only — omit or leave empty when tools are unknown. */
  tools?: string[];
};

export type AiCatalogueSectionMeta = {
  id: AiCatalogueSectionId;
  label: string;
  /** Singular noun for screen-reader counts ("1 skill", "3 skills"). */
  countNoun: string;
  empty: string;
};

export const AI_CATALOGUE_SECTIONS: readonly AiCatalogueSectionMeta[] = [
  { id: "skills", label: "skills", countNoun: "skill", empty: "no skills yet." },
  { id: "personas", label: "personas", countNoun: "persona", empty: "no personas yet." },
  { id: "mcp", label: "mcp", countNoun: "server", empty: "no mcp servers yet." },
  { id: "plugins", label: "plugins", countNoun: "plugin", empty: "no plugins yet." },
  { id: "rules", label: "rules", countNoun: "rule", empty: "no rules yet." },
] as const;

export const AI_CATALOGUE_ITEMS: readonly AiCatalogueItem[] = [
  {
    id: "skill-agent-workflow",
    section: "skills",
    name: "agent-workflow",
    description:
      "branches off main before edits; blocks unrequested commits, pushes, secrets, and destructive git.",
    status: "on",
    tags: ["git", "safety"],
    source: ".cursor/skills/agent-workflow/SKILL.md",
  },
  {
    id: "skill-client-server",
    section: "skills",
    name: "client-server",
    description: "nginx request path and vue ↔ fastapi pairing for api calls and routes.",
    status: "on",
    tags: ["api", "nginx"],
    source: ".cursor/skills/client-server/SKILL.md",
  },
  {
    id: "skill-client-ui",
    section: "skills",
    name: "client-ui",
    description: "toss-style visual language plus ux and accessibility priorities for the vue client.",
    status: "on",
    tags: ["ui", "a11y"],
    source: ".cursor/skills/client-ui/SKILL.md",
  },
  {
    id: "skill-python-fast-api",
    section: "skills",
    name: "python-fast-api",
    description: "fastapi conventions for this server package — motor, uv, ruff, thin routers.",
    status: "on",
    tags: ["python", "fastapi"],
    source: ".cursor/skills/python-fast-api/SKILL.md",
  },
  {
    id: "skill-saving-workspace-context",
    section: "skills",
    name: "saving-workspace-context",
    description: "saves a short active-task slice for the next session; durable facts stay elsewhere.",
    status: "on",
    tags: ["context"],
    source: ".cursor/skills/saving-workspace-context/SKILL.md",
  },
  {
    id: "skill-task-loop",
    section: "skills",
    name: "task-loop",
    description: "bounded manager → developer implementation workflow via /task-loop.",
    status: "on",
    tags: ["orchestration"],
    source: ".cursor/skills/task-loop/SKILL.md",
  },
  {
    id: "skill-vue",
    section: "skills",
    name: "vue",
    description: "vue 3 script-setup, typescript, pinia auth session, composables, and vitest.",
    status: "on",
    tags: ["vue", "typescript"],
    source: ".cursor/skills/vue/SKILL.md",
  },
  {
    id: "persona-manager",
    section: "personas",
    name: "manager",
    description: "recommends or assigns one task yaml; does not spawn other agents.",
    status: "on",
    tags: ["readonly"],
    source: ".cursor/agents/manager.md",
  },
  {
    id: "persona-developer",
    section: "personas",
    name: "developer",
    description: "implements scoped portfolio changes on cursor/* — only mutating persona.",
    status: "on",
    tags: ["mutate"],
    source: ".cursor/agents/developer.md",
  },
  {
    id: "persona-qa",
    section: "personas",
    name: "qa",
    description: "inspects and tests for bugs and regressions; does not modify application code.",
    status: "on",
    tags: ["readonly"],
    source: ".cursor/agents/qa.md",
  },
  {
    id: "persona-recruiter",
    section: "personas",
    name: "recruiter",
    description: "evaluates the portfolio for python / backend / it interview-invite signal.",
    status: "on",
    tags: ["readonly", "hiring"],
    source: ".cursor/agents/recruiter.md",
  },
  {
    id: "persona-ux",
    section: "personas",
    name: "ux",
    description: "audits ux, ui, usability, and accessibility. readonly.",
    status: "on",
    tags: ["readonly", "a11y"],
    source: ".cursor/agents/ux.md",
  },
  {
    id: "persona-code-reviewer",
    section: "personas",
    name: "code-reviewer",
    description:
      "pre-merge review across correctness, readability, architecture, security, and performance.",
    status: "on",
    tags: ["readonly", "review"],
    source: ".cursor/agents/code-reviewer.md",
  },
  {
    id: "mcp-gortex",
    section: "mcp",
    name: "gortex",
    description: "indexed code intelligence mcp for this checkout (explore, search, edit).",
    status: "on",
    tags: ["code-intel"],
    source: ".agents/mcp_config.json",
  },
  {
    id: "rule-agent-workflow",
    section: "rules",
    name: "agent-workflow",
    description: "always-on pointer to the agent-workflow skill for git, deps, and tests.",
    status: "on",
    tags: ["always"],
    source: ".cursor/rules/agent-workflow.mdc",
  },
  {
    id: "rule-client-server",
    section: "rules",
    name: "client-server",
    description: "path-triggered client ↔ server contract when editing vue or fastapi paths.",
    status: "on",
    tags: ["globs"],
    source: ".cursor/rules/client-server.mdc",
  },
  {
    id: "rule-client-ui",
    section: "rules",
    name: "client-ui",
    description: "path-triggered visual language and ux priorities for vue and css.",
    status: "on",
    tags: ["globs", "ui"],
    source: ".cursor/rules/client-ui.mdc",
  },
  {
    id: "rule-gortex-communities",
    section: "rules",
    name: "gortex-communities",
    description: "always-on pointer to the gortex community code-area map.",
    status: "on",
    tags: ["always", "gortex"],
    source: ".cursor/rules/gortex-communities.mdc",
  },
  {
    id: "rule-gortex-workflow",
    section: "rules",
    name: "gortex-workflow",
    description: "prefer gortex graph tools over whole-file reads when the mcp is available.",
    status: "on",
    tags: ["always", "gortex"],
    source: ".cursor/rules/gortex-workflow.mdc",
  },
  {
    id: "rule-project-context",
    section: "rules",
    name: "project-context",
    description: "portfolio purpose, hiring goal, real stack, and change guardrails.",
    status: "on",
    tags: ["always"],
    source: ".cursor/rules/project-context.mdc",
  },
  {
    id: "rule-python-fast-api",
    section: "rules",
    name: "python-fast-api",
    description: "path-triggered fastapi skill when editing server python.",
    status: "on",
    tags: ["globs", "python"],
    source: ".cursor/rules/python-fast-api.mdc",
  },
  {
    id: "rule-vue",
    section: "rules",
    name: "vue",
    description: "path-triggered vue skill when editing client typescript or vue files.",
    status: "on",
    tags: ["globs", "vue"],
    source: ".cursor/rules/vue.mdc",
  },
];
