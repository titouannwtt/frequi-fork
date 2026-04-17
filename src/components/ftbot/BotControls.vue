forceexit
<script setup lang="ts">
import type { MsgBoxObject } from '@/components/general/MessageBox.vue';
import type MessageBox from '@/components/general/MessageBox.vue';

import type { ForceExitPayload } from '@/types';
import { useI18n } from 'vue-i18n';

import ForceEntryForm from './ForceEntryForm.vue';

const { t } = useI18n();
const botStore = useBotStore();
const forceEnter = ref<boolean>(false);
const msgBox = ref<typeof MessageBox>();

const isRunning = computed((): boolean => {
  return botStore.activeBot.botState?.state === 'running';
});

const handleStopBot = () => {
  const msg: MsgBoxObject = {
    title: t('controls.stopBot'),
    message: t('controls.stopBotConfirm'),
    accept: () => {
      botStore.activeBot.stopBot();
    },
  };
  msgBox.value?.show(msg);
};

const handleStopBuy = () => {
  const msg: MsgBoxObject = {
    title: t('controls.pauseStopEntering'),
    message: t('controls.pause'),
    accept: () => {
      botStore.activeBot.stopBuy();
    },
  };
  msgBox.value?.show(msg);
};

const handleReloadConfig = () => {
  const msg: MsgBoxObject = {
    title: t('controls.reload'),
    message: t('controls.reloadConfirm'),
    accept: () => {
      console.log('reload...');
      botStore.activeBot.reloadConfig();
    },
  };
  msgBox.value?.show(msg);
};

const handleForceExit = () => {
  const msg: MsgBoxObject = {
    title: t('controls.forceExitAll'),
    message: t('controls.forceExitAllConfirm'),
    accept: () => {
      const payload: ForceExitPayload = {
        tradeid: 'all',
        // TODO: support ordertype (?)
      };
      botStore.activeBot.forceexit(payload);
    },
  };
  msgBox.value?.show(msg);
};
</script>

<template>
  <div class="flex flex-row gap-1">
    <Button
      size="large"
      severity="secondary"
      :disabled="!botStore.activeBot.isTrading || isRunning"
      :title="t('controls.startTrading')"
      @click="botStore.activeBot.startBot()"
    >
      <template #icon>
        <i-mdi-play />
      </template>
    </Button>
    <Button
      size="large"
      severity="secondary"
      :disabled="!botStore.activeBot.isTrading || !isRunning"
      :title="t('controls.stopTrading')"
      @click="handleStopBot()"
    >
      <template #icon>
        <i-mdi-stop />
      </template>
    </Button>
    <Button
      size="large"
      severity="secondary"
      :disabled="!botStore.activeBot.isTrading || !isRunning"
      :title="t('controls.pause')"
      @click="handleStopBuy()"
    >
      <template #icon>
        <i-mdi-pause />
      </template>
    </Button>
    <Button
      size="large"
      severity="secondary"
      :disabled="!botStore.activeBot.isTrading"
      :title="t('controls.reloadConfig')"
      @click="handleReloadConfig()"
    >
      <template #icon>
        <i-mdi-reload />
      </template>
    </Button>
    <Button
      severity="secondary"
      size="large"
      :disabled="!botStore.activeBot.isTrading"
      :title="t('controls.forceExitAll')"
      @click="handleForceExit()"
    >
      <template #icon>
        <i-mdi-close-box-multiple />
      </template>
    </Button>
    <Button
      v-if="botStore.activeBot.botState && botStore.activeBot.botState.force_entry_enable"
      size="large"
      severity="secondary"
      :disabled="!botStore.activeBot.isTrading || !isRunning"
      :title="t('controls.forceEnter')"
      @click="forceEnter = true"
    >
      <template #icon>
        <i-mdi-plus-box-multiple-outline />
      </template>
    </Button>
    <Button
      v-if="botStore.activeBot.isWebserverMode && false"
      size="large"
      severity="secondary"
      :disabled="botStore.activeBot.isTrading"
      title="Start Trading mode"
      @click="botStore.activeBot.startTrade()"
    >
      <template #icon>
        <i-mdi-play />
      </template>
    </Button>
    <ForceEntryForm v-model="forceEnter" :pair="botStore.activeBot.selectedPair" />
    <MessageBox ref="msgBox" />
  </div>
</template>
