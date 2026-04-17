<script setup lang="ts">
import type { Lock } from '@/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const botStore = useBotStore();

function removePairLock(item: Lock) {
  console.log(item);
  if (item.id !== undefined) {
    botStore.activeBot.deleteLock(item.id);
  } else {
    showAlert('This Freqtrade version does not support deleting locks.');
  }
}
</script>

<template>
  <div>
    <div class="mb-2">
      <label class="me-auto text-xl">{{ t('pairLocks.title') }}</label>
      <Button class="float-end" severity="secondary" @click="botStore.activeBot.getLocks">
        <template #icon>
          <i-mdi-refresh />
        </template>
      </Button>
    </div>
    <div>
      <DataTable size="small" :value="botStore.activeBot.activeLocks">
        <Column field="pair" :header="t('pairLocks.pair')"></Column>
        <Column field="lock_end_timestamp" :header="t('pairLocks.until')">
          <template #body="{ data, field }">
            {{ timestampms(data[field as string]) }}
          </template>
        </Column>
        <Column field="reason" :header="t('pairLocks.reason')"></Column>
        <Column field="actions" :header="t('pairLocks.actions')">
          <template #body="{ data }">
            <Button
              class="btn-xs ms-1"
              size="small"
              severity="secondary"
              :title="t('pairLocks.deleteLock')"
              @click="removePairLock(data as Lock)"
            >
              <i-mdi-delete />
            </Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
