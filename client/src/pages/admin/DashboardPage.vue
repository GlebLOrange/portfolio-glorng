<script setup lang="ts">
import { RouterLink } from "vue-router";

import MaintenanceJobActions from "@/components/admin/MaintenanceJobActions.vue";
import AdminPageLayout from "@/components/layout/AdminPageLayout.vue";
import { usePermissions } from "@/composables/usePermissions";
import { FOCUS_RING_DEFAULT } from "@/constants/httpStatusColors";

const { isSuperuser } = usePermissions();
</script>

<template>
  <AdminPageLayout title="admin" hub="tools" back-to="/tools">
    <div v-if="isSuperuser" class="page-tool-actions mb-8 flex flex-col gap-4">
      <MaintenanceJobActions mode="hub" />
      <RouterLink
        to="/admin/page-catalogue"
        class="inline-flex min-h-11 w-fit items-center rounded-lg bg-surface-card px-3 text-sm font-semibold text-surface-light outline-none hover:bg-surface-grid/50 focus-visible:ring-2"
        :class="FOCUS_RING_DEFAULT"
      >
        catalogue
      </RouterLink>
    </div>
    <p
      v-else
      class="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-surface-sage"
      role="status"
    >
      Admin tools live on the tools page for site owners. Ask the site owner if you need access.
    </p>
  </AdminPageLayout>
</template>
