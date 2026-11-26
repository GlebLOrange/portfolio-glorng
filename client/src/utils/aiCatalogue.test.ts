import { describe, expect, it } from "vitest";

import {
  AI_CATALOGUE_ITEMS,
  AI_CATALOGUE_SECTION_IDS,
  type AiCatalogueItem,
} from "@/constants/aiCatalogue";
import {
  filterAiCatalogue,
  isAiCatalogueFiltering,
  summarizeAiCatalogueSections,
} from "@/utils/aiCatalogue";

const FIXTURE: AiCatalogueItem[] = [
  {
    id: "skill-a",
    section: "skills",
    name: "agent-workflow",
    description: "git safety skill",
    status: "on",
    tags: ["git"],
    source: ".cursor/skills/agent-workflow/SKILL.md",
  },
  {
    id: "skill-b",
    section: "skills",
    name: "vue",
    description: "vue client skill",
    status: "off",
    tags: ["vue"],
  },
  {
    id: "persona-a",
    section: "personas",
    name: "manager",
    description: "assigns work",
    status: "on",
  },
  {
    id: "mcp-a",
    section: "mcp",
    name: "gortex",
    description: "code intel",
    status: "on",
    tools: ["explore", "search"],
  },
  {
    id: "rule-a",
    section: "rules",
    name: "project-context",
    description: "hiring goal",
    status: "error",
    version: "1.0",
  },
];

describe("filterAiCatalogue", () => {
  it("keeps fixed section order including empty plugins when unfiltered", () => {
    const sections = filterAiCatalogue(FIXTURE, {
      query: "",
      section: "all",
      status: "any",
    });
    expect(sections.map((s) => s.meta.id)).toEqual([...AI_CATALOGUE_SECTION_IDS]);
    expect(sections.find((s) => s.meta.id === "plugins")?.items).toEqual([]);
  });

  it("matches query against name, description, tags, version, source, and mcp tools", () => {
    expect(
      filterAiCatalogue(FIXTURE, { query: "git", section: "all", status: "any" }).flatMap(
        (s) => s.items.map((i) => i.id),
      ),
    ).toEqual(["skill-a"]);

    expect(
      filterAiCatalogue(FIXTURE, { query: "explore", section: "all", status: "any" }).flatMap(
        (s) => s.items.map((i) => i.id),
      ),
    ).toEqual(["mcp-a"]);

    expect(
      filterAiCatalogue(FIXTURE, { query: "1.0", section: "all", status: "any" }).flatMap(
        (s) => s.items.map((i) => i.id),
      ),
    ).toEqual(["rule-a"]);
  });

  it("filters by status and hides empty sections while filtering", () => {
    const sections = filterAiCatalogue(FIXTURE, {
      query: "",
      section: "all",
      status: "off",
    });
    expect(isAiCatalogueFiltering({ query: "", section: "all", status: "off" })).toBe(true);
    expect(sections.map((s) => s.meta.id)).toEqual(["skills"]);
    expect(sections[0]?.items.map((i) => i.id)).toEqual(["skill-b"]);
  });

  it("returns a single empty section when a section chip has no rows", () => {
    const sections = filterAiCatalogue(FIXTURE, {
      query: "",
      section: "plugins",
      status: "any",
    });
    expect(sections).toHaveLength(1);
    expect(sections[0]?.meta.id).toBe("plugins");
    expect(sections[0]?.items).toEqual([]);
  });

  it("summarizes visible matches for the live region", () => {
    const sections = filterAiCatalogue(FIXTURE, {
      query: "",
      section: "all",
      status: "on",
    });
    expect(summarizeAiCatalogueSections(sections)).toBe("1 skill, 1 persona, 1 server");
    expect(summarizeAiCatalogueSections([])).toBe("no matches");
  });

  it("seeds the real catalogue with all five sections and no plugins", () => {
    const sections = filterAiCatalogue(AI_CATALOGUE_ITEMS, {
      query: "",
      section: "all",
      status: "any",
    });
    expect(sections.map((s) => s.meta.id)).toEqual([...AI_CATALOGUE_SECTION_IDS]);
    expect(sections.find((s) => s.meta.id === "plugins")?.items).toEqual([]);
    expect(sections.find((s) => s.meta.id === "skills")?.items.length).toBe(7);
    expect(sections.find((s) => s.meta.id === "personas")?.items.length).toBe(6);
    expect(sections.find((s) => s.meta.id === "mcp")?.items.length).toBe(1);
    expect(sections.find((s) => s.meta.id === "rules")?.items.length).toBe(8);
  });
});
