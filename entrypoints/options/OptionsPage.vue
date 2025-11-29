<script lang="ts" setup>
import { LogLevel } from '@/utils/enums/log-level';
import { ref } from 'vue';
import {
  featuresStorage,
  logLevelStorage,
  searchStringStorage,
  SETTING_FEATURES,
  SETTING_LOG_LEVELS,
  SETTING_SEARCH_STRINGS,
  SettingFeatures,
  SettingLogLevels,
  SettingSearchStrings,
} from '@/utils/storage';
import LogLevels from '@/components/LogLevels.vue';
import SearchStrings from '@/components/SearchStrings.vue';
import DisableFeatureToggles from '@/components/DisableFeatureToggles.vue';

function defaultLogLevel() {
  return import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;
}

const loggers = ref<SettingLogLevels>(logLevelStorage.fallback);
logLevelStorage.getValue().then((levels) => (loggers.value = levels));

const settingSearchStrings = ref<SettingSearchStrings>(searchStringStorage.fallback);
searchStringStorage.getValue().then((strings) => (settingSearchStrings.value = strings));

const settingFeatureToggles = ref<SettingFeatures<boolean>>(featuresStorage.fallback);
featuresStorage.getValue().then((features) => (settingFeatureToggles.value = features));

const settingsSavedToast = ref(false);

function handleLogLevelChange({ loggerName, level }: { loggerName: keyof SettingLogLevels; level: LogLevel }) {
  loggers.value[loggerName] = level;
  storage.setItem<SettingLogLevels>(SETTING_LOG_LEVELS, {
    ...loggers.value,
    [loggerName]: level,
  });
  showSavedToast();
}

function handleSearchSettingsChange(data: SettingSearchStrings) {
  storage.setItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS, data);
  showSavedToast();
}

function handleFeatureChange(data: SettingFeatures<boolean>) {
  storage.setItem<SettingFeatures<boolean>>(SETTING_FEATURES, data);
  showSavedToast();
}

function showSavedToast() {
  settingsSavedToast.value = true;
  setTimeout(() => {
    settingsSavedToast.value = false;
  }, 2000);
}
</script>

<template>
  <h1 class="text-3xl mb-8">Settings</h1>

  <div class="tabs tabs-border w-lg">
    <input type="radio" name="setting_tabs" class="tab" aria-label="Disable features" checked />
    <div class="tab-content border-base-300 bg-base-200 p-10">
      <DisableFeatureToggles :feature-toggles="settingFeatureToggles" @change="handleFeatureChange" />
    </div>

    <input type="radio" name="setting_tabs" class="tab" aria-label="Search strings" checked />
    <div class="tab-content border-base-300 bg-base-200 p-10">
      <SearchStrings :search-strings="settingSearchStrings" @change="handleSearchSettingsChange" />
    </div>

    <input type="radio" name="setting_tabs" class="tab" aria-label="Logging" />
    <div class="tab-content border-base-300 bg-base-200 p-10">
      <LogLevels :log-levels="loggers" @log-level-changed="handleLogLevelChange" />
    </div>
  </div>

  <div v-if="settingsSavedToast" class="toast toast-center">
    <div class="alert alert-success">
      <span>Settings saved.</span>
    </div>
  </div>
</template>

<style scoped></style>
