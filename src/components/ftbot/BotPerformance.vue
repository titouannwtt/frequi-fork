<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const botStore = useBotStore();
enum PerformanceOptions {
  performance = 'performance',
  entryStats = 'entryStats',
  exitStats = 'exitStats',
  mixTagStats = 'mixTagStats',
}
const selectedOption = ref<PerformanceOptions>(PerformanceOptions.performance);

function formatTextLen(text: string, len: number) {
  if (text.length > len) {
    return text.substring(0, len) + '...';
  }
  return text;
}

const performanceTable = computed<
  {
    key: string;
    label: string;
    formatter?: (v: unknown) => string;
  }[]
>(() => {
  const textLength = 17;
  const initialCol = {
    [PerformanceOptions.performance]: { key: 'pair', label: t('performance.pair') },
    [PerformanceOptions.entryStats]: {
      key: 'enter_tag',
      label: t('performance.enterTag'),
      formatter: (v: unknown) => formatTextLen(v as string, textLength),
    },
    [PerformanceOptions.exitStats]: {
      key: 'exit_reason',
      label: t('performance.exitReason'),
      formatter: (v: unknown) => formatTextLen(v as string, textLength),
    },
    [PerformanceOptions.mixTagStats]: {
      key: 'mix_tag',
      label: t('performance.mixTag'),
      formatter: (v: unknown) => formatTextLen(v as string, textLength),
    },
  };
  return [
    initialCol[selectedOption.value],
    { key: 'profit', label: t('performance.profitPct') },
    {
      key: 'profit_abs',
      label: t('performance.profitStake', { stake: botStore.activeBot.botState?.stake_currency }),
      formatter: (v: unknown) => formatPrice(v as number, 5),
    },
    { key: 'count', label: t('performance.count') },
  ];
});

const performanceData = computed(() => {
  if (selectedOption.value === PerformanceOptions.performance) {
    return botStore.activeBot.performanceStats;
  }
  if (selectedOption.value === PerformanceOptions.entryStats) {
    return botStore.activeBot.entryStats;
  }
  if (selectedOption.value === PerformanceOptions.exitStats) {
    return botStore.activeBot.exitStats;
  }
  if (selectedOption.value === PerformanceOptions.mixTagStats) {
    return botStore.activeBot.mixTagStats;
  }
  return [];
});

const options = computed(() => [
  { value: PerformanceOptions.performance, text: t('performance.title') },
  { value: PerformanceOptions.entryStats, text: t('performance.entries') },
  { value: PerformanceOptions.exitStats, text: t('performance.exits') },
  { value: PerformanceOptions.mixTagStats, text: t('performance.mixTag') },
]);

function refreshSummary() {
  if (selectedOption.value === PerformanceOptions.performance) {
    botStore.activeBot.getPerformance();
  }
  if (selectedOption.value === PerformanceOptions.entryStats) {
    botStore.activeBot.getEntryStats();
  }
  if (selectedOption.value === PerformanceOptions.exitStats) {
    botStore.activeBot.getExitStats();
  }
  if (selectedOption.value === PerformanceOptions.mixTagStats) {
    botStore.activeBot.getMixTagStats();
  }
}

onMounted(() => {
  refreshSummary();
});
</script>
<template>
  <div>
    <div class="mb-2">
      <h3 class="me-auto text-2xl inline">{{ t('performance.title') }}</h3>
      <Button class="float-end" severity="secondary" @click="refreshSummary">
        <template #icon>
          <i-mdi-refresh />
        </template>
      </Button>
    </div>
    <SelectButton
      v-if="botStore.activeBot.botFeatures.hasAdvancedStats"
      id="order-direction"
      v-model="selectedOption"
      :options="options"
      :allow-empty="false"
      option-label="text"
      option-value="value"
      size="small"
      @change="refreshSummary"
    ></SelectButton>
    <DataTable size="small" class="text-center" :value="performanceData">
      <Column
        v-for="field in performanceTable"
        :key="field.key"
        :field="field.key"
        :header="field.label"
      >
        <template #body="slotProps">
          {{
            field.formatter ? field.formatter(slotProps.data[field.key]) : slotProps.data[field.key]
          }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
