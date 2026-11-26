<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";

import AdminFilterChip from "@/components/admin/AdminFilterChip.vue";
import AdminFilterDropdown from "@/components/admin/AdminFilterDropdown.vue";
import AdminListToolbar from "@/components/admin/AdminListToolbar.vue";
import CatalogueItemRow from "@/components/catalogue/CatalogueItemRow.vue";
import AdminPageLayout from "@/components/layout/AdminPageLayout.vue";
import ToolsCatalogSection from "@/components/tools/ToolsCatalogSection.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import SearchInput from "@/components/ui/SearchInput.vue";
import { useMediaQuery } from "@/composables/useMediaQuery";
import {
  AI_CATALOGUE_ITEMS,
  AI_CATALOGUE_SECTIONS,
  type AiCatalogueSectionId,
} from "@/constants/aiCatalogue";
import { FOCUS_RING_DEFAULT } from "@/constants/httpStatusColors";
import {
  aiCatalogueStatusClass,
  filterAiCatalogue,
  isAiCatalogueFiltering,
  summarizeAiCatalogueSections,
  type AiCatalogueSectionFilter,
  type AiCatalogueStatusFilter,
} from "@/utils/aiCatalogue";

const isNarrow = useMediaQuery("(max-width: 767px)");

const query = ref("");
const sectionFilter = ref<AiCatalogueSectionFilter>("all");
const statusFilter = ref<AiCatalogueStatusFilter>("any");
const settledSummary = ref("");

const STATUS_OPTIONS: { value: AiCatalogueStatusFilter; label: string }[] = [
  { value: "any", label: "any" },
  { value: "on", label: "on" },
  { value: "off", label: "off" },
  { value: "error", label: "error" },
];

const SECTION_OPTIONS: { value: AiCatalogueSectionFilter; label: string }[] = [
  { value: "all", label: "all" },
  ...AI_CATALOGUE_SECTIONS.map((meta) => ({ value: meta.id, label: meta.label })),
];

const filterInput = computed(() => ({
  query: query.value,
  section: sectionFilter.value,
  status: statusFilter.value,
}));

const filtering = computed(() => isAiCatalogueFiltering(filterInput.value));

const visibleSections = computed(() => filterAiCatalogue(AI_CATALOGUE_ITEMS, filterInput.value));

/** Page-level empty only when browsing all sections; a section chip keeps its own empty line. */
const hasNoMatches = computed(
  () =>
    filtering.value &&
    sectionFilter.value === "all" &&
    visibleSections.value.every((section) => section.items.length === 0),
);

const hasActiveStatusFilter = computed(() => statusFilter.value !== "any");

const statusActiveLabel = computed(() =>
  statusFilter.value === "any" ? undefined : statusFilter.value,
);

const sectionOpenOverrides = reactive<Record<string, boolean>>({});
const OPEN_STORAGE_PREFIX = "catalogue:open-sections:";

function openStorageKey(): string {
  return `${OPEN_STORAGE_PREFIX}${isNarrow.value ? "narrow" : "wide"}`;
}

function readStoredOpen(): Record<string, boolean> {
  try {
    const raw = sessionStorage.getItem(openStorageKey());
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, boolean] =>
          /^[a-z0-9-]{1,32}$/.test(entry[0]) && typeof entry[1] === "boolean",
      ),
    );
  } catch {
    return {};
  }
}

function persistOpen(): void {
  try {
    sessionStorage.setItem(openStorageKey(), JSON.stringify({ ...sectionOpenOverrides }));
  } catch {
    /* storage full / disabled — memory is best-effort */
  }
}

function resetOverrides(): void {
  for (const key of Object.keys(sectionOpenOverrides)) {
    delete sectionOpenOverrides[key];
  }
  Object.assign(sectionOpenOverrides, readStoredOpen());
}

watch(isNarrow, resetOverrides);
resetOverrides();

function defaultSectionOpen(_id: string): boolean {
  return !isNarrow.value;
}

function isSectionOpen(id: string): boolean {
  if (filtering.value) {
    const section = visibleSections.value.find((entry) => entry.meta.id === id);
    if (section && section.items.length > 0) return true;
  }
  if (id in sectionOpenOverrides) return sectionOpenOverrides[id]!;
  return defaultSectionOpen(id);
}

function onSectionToggle(id: string, open: boolean): void {
  if (open === isSectionOpen(id)) return;
  sectionOpenOverrides[id] = open;
  persistOpen();
}

function setSectionFilter(value: AiCatalogueSectionFilter): void {
  sectionFilter.value = value;
}

function setStatusFilter(value: AiCatalogueStatusFilter): void {
  statusFilter.value = value;
}

function clearStatusFilter(): void {
  statusFilter.value = "any";
}

function clearSearchAndFilters(): void {
  query.value = "";
  statusFilter.value = "any";
  sectionFilter.value = "all";
}

function sectionEmptyCopy(id: AiCatalogueSectionId): string {
  if (filtering.value) return "no matches.";
  return AI_CATALOGUE_SECTIONS.find((meta) => meta.id === id)?.empty ?? "no items yet.";
}

function onSectionRadioKeydown(event: KeyboardEvent, index: number): void {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
  const next = (index + delta + SECTION_OPTIONS.length) % SECTION_OPTIONS.length;
  const option = SECTION_OPTIONS[next];
  if (!option) return;
  setSectionFilter(option.value);
  void nextTick(() => {
    document.getElementById(`catalogue-section-${option.value}`)?.focus();
  });
}

let announceTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  visibleSections,
  (sections) => {
    if (announceTimer) clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      settledSummary.value = summarizeAiCatalogueSections(sections);
    }, 300);
  },
  { immediate: true },
);

watch(filtering, (active, wasActive) => {
  if (wasActive && !active) {
    // Restore remembered open state after clearing search/status.
    resetOverrides();
  }
});
</script>

<template>
  <AdminPageLayout
    title="catalogue"
    hub="admin"
    back-to="/admin"
    body-width="content"
    description="skills, personas, mcp servers, plugins, and rules."
  >
    <p class="mb-4 text-sm text-surface-sage">
      skills, personas, mcp servers, plugins, and rules.
    </p>

    <div class="mb-3">
      <SearchInput
        v-model="query"
        aria-label="search catalogue"
        placeholder="name, description, or tag"
      />
    </div>

    <AdminListToolbar>
      <div
        class="flex min-w-0 flex-wrap items-center gap-2"
        role="radiogroup"
        aria-label="section"
      >
        <button
          v-for="(option, index) in SECTION_OPTIONS"
          :id="`catalogue-section-${option.value}`"
          :key="option.value"
          type="button"
          role="radio"
          :aria-checked="sectionFilter === option.value"
          class="inline-flex min-h-11 items-center rounded-lg px-3 text-sm outline-none focus-visible:ring-2"
          :class="[
            FOCUS_RING_DEFAULT,
            sectionFilter === option.value
              ? 'bg-accent-coral/15 font-semibold text-accent-coral'
              : 'text-surface-mid hover:bg-surface-grid/50',
          ]"
          @click="setSectionFilter(option.value)"
          @keydown="onSectionRadioKeydown($event, index)"
        >
          {{ option.label }}
        </button>
      </div>
      <template #actions>
        <AdminFilterDropdown
          label="status"
          show-filter-icon
          show-clear
          :has-active-filters="hasActiveStatusFilter"
          :active-label="statusActiveLabel"
          :option-labels="STATUS_OPTIONS.map((option) => option.label)"
          @clear="clearStatusFilter"
        >
          <template #chips>
            <AdminFilterChip
              v-for="option in STATUS_OPTIONS"
              :key="option.value"
              :label="option.label"
              :active="statusFilter === option.value"
              :color-class="
                option.value === 'any' ? undefined : aiCatalogueStatusClass(option.value)
              "
              @click="setStatusFilter(option.value)"
            />
          </template>
        </AdminFilterDropdown>
      </template>
    </AdminListToolbar>

    <p class="sr-only" role="status" aria-live="polite">{{ settledSummary }}</p>

    <EmptyState v-if="hasNoMatches" description="no matches.">
      <template #action>
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-lg bg-accent-coral px-4 text-sm font-semibold text-on-accent outline-none focus-visible:ring-2"
          :class="FOCUS_RING_DEFAULT"
          @click="clearSearchAndFilters"
        >
          clear search
        </button>
      </template>
    </EmptyState>

    <div v-else class="space-y-4">
      <ToolsCatalogSection
        v-for="section in visibleSections"
        :id="section.meta.id"
        :key="section.meta.id"
        :label="section.meta.label"
        :count="section.items.length"
        :count-noun="section.meta.countNoun"
        :open="isSectionOpen(section.meta.id)"
        @toggle="onSectionToggle(section.meta.id, $event)"
      >
        <EmptyState
          v-if="section.items.length === 0"
          :description="sectionEmptyCopy(section.meta.id)"
        />
        <ul v-else class="divide-y divide-surface-border/50">
          <CatalogueItemRow v-for="item in section.items" :key="item.id" :item="item" />
        </ul>
      </ToolsCatalogSection>
    </div>
  </AdminPageLayout>
</template>
