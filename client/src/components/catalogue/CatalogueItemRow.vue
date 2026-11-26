<script setup lang="ts">
import { computed } from "vue";

import StatusBadge from "@/components/ui/StatusBadge.vue";
import type { AiCatalogueItem } from "@/constants/aiCatalogue";
import {
  aiCatalogueStatusClass,
  formatAiCatalogueMetadata,
} from "@/utils/aiCatalogue";

const props = defineProps<{
  item: AiCatalogueItem;
}>();

const metadata = computed(() => formatAiCatalogueMetadata(props.item));
const statusClass = computed(() => aiCatalogueStatusClass(props.item.status));
</script>

<template>
  <li class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline gap-2">
        <span class="truncate text-sm font-semibold text-surface-light">{{ item.name }}</span>
        <StatusBadge class="ml-auto shrink-0 sm:hidden" :label="item.status" :class-name="statusClass" />
      </div>
      <p v-if="item.description" class="mt-0.5 truncate text-sm text-surface-mid">
        {{ item.description }}
      </p>
      <p v-if="metadata" class="mt-1 text-xs text-text-muted sm:hidden">{{ metadata }}</p>
    </div>
    <div class="hidden shrink-0 items-baseline gap-2 sm:flex sm:flex-col sm:items-end">
      <StatusBadge :label="item.status" :class-name="statusClass" />
      <p v-if="metadata" class="max-w-[18rem] text-right text-xs text-text-muted">{{ metadata }}</p>
    </div>
  </li>
</template>
