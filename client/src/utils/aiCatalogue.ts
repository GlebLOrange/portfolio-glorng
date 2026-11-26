import {
  AI_CATALOGUE_SECTIONS,
  type AiCatalogueItem,
  type AiCatalogueSectionId,
  type AiCatalogueSectionMeta,
  type AiCatalogueStatus,
} from "@/constants/aiCatalogue";
import { familyBadgeClass } from "@/constants/httpStatusColors";

export type AiCatalogueSectionFilter = "all" | AiCatalogueSectionId;
export type AiCatalogueStatusFilter = "any" | AiCatalogueStatus;

export type AiCatalogueFilterInput = {
  query: string;
  section: AiCatalogueSectionFilter;
  status: AiCatalogueStatusFilter;
};

export type AiCatalogueVisibleSection = {
  meta: AiCatalogueSectionMeta;
  items: AiCatalogueItem[];
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function itemMatchesQuery(item: AiCatalogueItem, needle: string): boolean {
  if (!needle) return true;
  const haystacks: string[] = [
    item.name,
    item.description,
    item.version ?? "",
    item.source ?? "",
    ...(item.tags ?? []),
    ...(item.tools ?? []),
  ];
  return haystacks.some((part) => part.toLowerCase().includes(needle));
}

function itemMatchesStatus(item: AiCatalogueItem, status: AiCatalogueStatusFilter): boolean {
  if (status === "any") return true;
  return item.status === status;
}

export function isAiCatalogueFiltering(input: AiCatalogueFilterInput): boolean {
  return normalizeQuery(input.query).length > 0 || input.status !== "any";
}

/**
 * Filter catalogue items and group by fixed section order.
 * Unfiltered: every section appears (including empty plugins).
 * While search/status is active: hide sections with zero matches.
 * A section chip still returns that one section even when empty.
 */
export function filterAiCatalogue(
  items: readonly AiCatalogueItem[],
  input: AiCatalogueFilterInput,
): AiCatalogueVisibleSection[] {
  const needle = normalizeQuery(input.query);
  const filtering = isAiCatalogueFiltering(input);

  const matched = items.filter((item) => {
    if (input.section !== "all" && item.section !== input.section) return false;
    if (!itemMatchesStatus(item, input.status)) return false;
    return itemMatchesQuery(item, needle);
  });

  const bySection = new Map<AiCatalogueSectionId, AiCatalogueItem[]>();
  for (const item of matched) {
    const list = bySection.get(item.section) ?? [];
    list.push(item);
    bySection.set(item.section, list);
  }

  const sectionMetas =
    input.section === "all"
      ? AI_CATALOGUE_SECTIONS
      : AI_CATALOGUE_SECTIONS.filter((meta) => meta.id === input.section);

  return sectionMetas
    .map((meta) => ({
      meta,
      items: bySection.get(meta.id) ?? [],
    }))
    .filter((section) => {
      if (input.section !== "all") return true;
      if (!filtering) return true;
      return section.items.length > 0;
    });
}

/** Screen-reader / live-region summary, e.g. "3 skills, 1 plugin" or "no matches". */
export function summarizeAiCatalogueSections(sections: AiCatalogueVisibleSection[]): string {
  const parts = sections
    .filter((section) => section.items.length > 0)
    .map((section) => {
      const n = section.items.length;
      const noun = section.meta.countNoun;
      return n === 1 ? `1 ${noun}` : `${n} ${noun}s`;
    });
  return parts.length > 0 ? parts.join(", ") : "no matches";
}

export function aiCatalogueStatusClass(status: AiCatalogueStatus): string {
  if (status === "on") return familyBadgeClass("2xx");
  if (status === "error") return familyBadgeClass("4xx");
  return "text-surface-mid bg-surface-mid/10 border-surface-border";
}

export function formatAiCatalogueMetadata(item: AiCatalogueItem): string {
  const parts: string[] = [];
  const tags = item.tags ?? [];
  if (tags.length > 0) {
    const shown = tags.slice(0, 3);
    const extra = tags.length - shown.length;
    parts.push(extra > 0 ? `${shown.join(", ")} +${extra}` : shown.join(", "));
  }
  if (item.version) parts.push(item.version);
  if (item.source) parts.push(item.source);
  const tools = item.tools ?? [];
  if (tools.length > 0) parts.push(tools.join(", "));
  return parts.join(" · ");
}
