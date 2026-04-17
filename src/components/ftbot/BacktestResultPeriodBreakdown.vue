<script setup lang="ts">
import type { PeriodicBreakdown } from '@/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  periodicBreakdown: PeriodicBreakdown;
}>();

const periodicBreakdownSelections = computed(() => {
  const res = [
    { value: 'day', text: t('periodBreakdown.days') },
    { value: 'week', text: t('periodBreakdown.weeks') },
    { value: 'month', text: t('periodBreakdown.months') },
  ];
  if (props.periodicBreakdown.year) {
    res.push({ value: 'year', text: t('periodBreakdown.years') });
  }
  if (props.periodicBreakdown.weekday) {
    res.push({ value: 'weekday', text: t('periodBreakdown.weekday') });
  }

  return res;
});

const periodicBreakdownPeriod = ref<string>('month');
</script>

<template>
  <SelectButton
    v-model="periodicBreakdownPeriod"
    :options="periodicBreakdownSelections"
    size="small"
    :allow-empty="false"
    class="m-2"
    option-label="text"
    option-value="value"
  ></SelectButton>
  <DataTable size="small" stacked="sm" :value="periodicBreakdown[periodicBreakdownPeriod]">
    <Column field="date" :header="t('periodBreakdown.date')"></Column>
    <Column field="trades" :header="t('periodBreakdown.trades')">
      <template #body="{ data, field }">
        {{ data[field as string] ?? 'N/A' }}
      </template>
    </Column>
    <Column field="profit_abs" :header="t('periodBreakdown.totalProfit')" :body="formatPrice">
      <template #body="{ data, field }">
        {{ formatNumber(data[field as string], 2) }}
      </template>
    </Column>
    <Column field="profit_factor" :header="t('periodBreakdown.profitFactor')">
      <template #body="{ data, field }">
        {{ formatPrice(data[field as string], 2) }}
      </template>
    </Column>
    <Column field="wins" :header="t('backtest.wins')"></Column>
    <Column field="draws" :header="t('backtest.draws')"></Column>
    <Column field="losses" :header="t('backtest.losses')">
      <template #body="{ data }">
        {{ data.loses ?? data.losses ?? 'N/A' }}
      </template>
    </Column>
    <Column field="wins" :header="t('periodBreakdown.winRate')">
      <template #body="{ data }">
        {{ formatPercent(data.wins / (data.wins + data.draws + (data.loses ?? data.losses)), 2) }}
      </template>
    </Column>
  </DataTable>
</template>
