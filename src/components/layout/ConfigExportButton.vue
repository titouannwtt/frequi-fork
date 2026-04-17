<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { exportConfig, importConfig } from '@/composables/useConfigExport';

const { t } = useI18n();

const showMenu = ref(false);
const importing = ref(false);
const importResult = ref<{ keysRestored: number; botCount: number } | null>(null);
const importError = ref('');
const fileInput = ref<HTMLInputElement>();

function doExport() {
  exportConfig();
  showMenu.value = false;
}

function triggerImport() {
  fileInput.value?.click();
}

async function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  importing.value = true;
  importError.value = '';
  importResult.value = null;

  try {
    const result = await importConfig(file);
    importResult.value = result;
    // Reload after a short delay to apply all settings
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (err: any) {
    importError.value = err?.message ?? 'Import failed';
  } finally {
    importing.value = false;
    input.value = ''; // Reset file input
  }
}
</script>

<template>
  <div class="relative">
    <!-- Trigger button -->
    <button
      class="p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors cursor-pointer"
      title="Export / Import config"
      @click.stop="showMenu = !showMenu"
    >
      <i-mdi-cog-transfer class="w-5 h-5 text-surface-400 hover:text-surface-200" />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="showMenu"
      class="absolute right-0 top-full mt-1 min-w-[220px] rounded-lg shadow-xl p-2 space-y-1"
      style="z-index: 9999; background: rgba(15,17,23,0.96); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08)"
    >
      <div class="text-[10px] text-surface-500 uppercase tracking-wider px-2 py-1">FreqUI Config</div>

      <!-- Export -->
      <button
        class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-surface-200 hover:bg-surface-700/50 cursor-pointer transition-colors"
        @click="doExport"
      >
        <i-mdi-download class="w-4 h-4 text-blue-400" />
        Export configuration
      </button>

      <!-- Import -->
      <button
        class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-surface-200 hover:bg-surface-700/50 cursor-pointer transition-colors"
        @click="triggerImport"
      >
        <i-mdi-upload class="w-4 h-4 text-green-400" />
        Import configuration
      </button>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleFileSelected"
      />

      <!-- Import progress -->
      <div v-if="importing" class="flex items-center gap-2 px-2 py-1 text-[11px] text-surface-400">
        <i-mdi-loading class="w-3 h-3 animate-spin" />
        Importing...
      </div>

      <!-- Import result -->
      <div v-if="importResult" class="px-2 py-1 text-[11px] text-green-400">
        ✓ {{ importResult.keysRestored }} settings restored, {{ importResult.botCount }} bots
        <div class="text-[10px] text-surface-500">Reloading...</div>
      </div>

      <!-- Import error -->
      <div v-if="importError" class="px-2 py-1 text-[11px] text-red-400">
        ✗ {{ importError }}
      </div>

      <hr class="border-surface-700" />
      <div class="text-[9px] text-surface-600 px-2 py-0.5">
        Saves: bots, layout, filters, theme, alerts, benchmarks
      </div>
    </div>

    <!-- Click-away -->
    <div v-if="showMenu" class="fixed inset-0 z-40" @click="showMenu = false" />
  </div>
</template>
