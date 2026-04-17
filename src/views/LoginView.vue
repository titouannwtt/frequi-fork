<script setup lang="ts">
import { importConfig } from '@/composables/useConfigExport';

const importing = ref(false);
const importResult = ref<{ keysRestored: number; botCount: number } | null>(null);
const importError = ref('');
const fileInput = ref<HTMLInputElement>();

function triggerImport() {
  fileInput.value?.click();
}

async function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  importing.value = true;
  importError.value = '';
  try {
    const result = await importConfig(file);
    importResult.value = result;
    setTimeout(() => window.location.reload(), 1500);
  } catch (err: any) {
    importError.value = err?.message ?? 'Invalid file';
  } finally {
    importing.value = false;
    input.value = '';
  }
}
</script>

<template>
  <div class="border max-w-xl mx-auto p-4">
    <DraggableContainer header="Freqtrade bot Login">
      <BotLogin ref="loginForm" />
    </DraggableContainer>

    <!-- Import configuration -->
    <div class="mt-6 max-w-xl mx-auto text-center">
      <div class="border border-dashed border-surface-500 rounded-lg p-6">
        <i-mdi-cog-transfer class="w-8 h-8 text-surface-400 mx-auto mb-2" />
        <p class="text-sm text-surface-400 mb-3">
          Have a saved FreqUI configuration? Import it to restore your bots, layout, and preferences.
        </p>
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium text-blue-400 border border-blue-500/40 hover:bg-blue-500/10 transition-colors cursor-pointer"
          :disabled="importing"
          @click="triggerImport"
        >
          <i-mdi-upload class="w-4 h-4 inline mr-1 align-text-bottom" />
          Import configuration
        </button>

        <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileSelected" />

        <div v-if="importing" class="mt-2 text-xs text-surface-400">
          <i-mdi-loading class="w-3 h-3 inline animate-spin mr-1" /> Importing...
        </div>
        <div v-if="importResult" class="mt-2 text-xs text-green-400">
          ✓ {{ importResult.keysRestored }} settings restored, {{ importResult.botCount }} bots — reloading...
        </div>
        <div v-if="importError" class="mt-2 text-xs text-red-400">
          ✗ {{ importError }}
        </div>
      </div>
    </div>
  </div>
</template>
