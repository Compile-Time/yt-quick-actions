<script lang="ts" setup>
import { LogLevel } from '@/utils/enums/log-level';
import { ref } from 'vue';
import {
  SETTING_LOG_LEVELS,
  SETTING_SEARCH_STRINGS,
  SettingLogLevels,
  SettingSearchStrings,
} from '@/utils/storage/settings-data';
import LogLevels from '@/components/LogLevels.vue';
import SearchStrings from '@/components/SearchStrings.vue';

function defaultLogLevel() {
  return import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;
}

const loggers = ref<SettingLogLevels>({
  homePage: defaultLogLevel(),
  watchVideo: defaultLogLevel(),
  watchPlaylist: defaultLogLevel(),
  playlist: defaultLogLevel(),
});
storage.getItem<SettingLogLevels>(SETTING_LOG_LEVELS).then((levels) => {
  if (levels) {
    loggers.value = levels;
  }
});

const settingSearchStrings = ref<SettingSearchStrings>({
  homePageWatchLaterEntry: undefined,
  playlistMoveBottomEntry: undefined,
  playlistMoveTopEntry: undefined,
  playlistRemoveEntry: undefined,
  videoWatchLaterEntry: undefined,
  watchingPlaylistRemoveEntry: undefined,
  watchingPlaylistWatchLaterEntry: undefined,
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((strings) => {
  if (strings) {
    settingSearchStrings.value = strings;
  }
});

const settingsSavedToast = ref(false);

function handleLogLevelChange({ loggerName, level }: { loggerName: keyof SettingLogLevels; level: LogLevel }) {
  loggers.value[loggerName] = level;
  storage.setItem<SettingLogLevels>(SETTING_LOG_LEVELS, {
    ...loggers.value,
    [loggerName]: level,
  });
  handleSaveSettings();
}

function handleSearchSettingsChange(data: SettingSearchStrings) {
  storage.setItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS, data);
  handleSaveSettings();
}

function handleSaveSettings() {
  settingsSavedToast.value = true;
  setTimeout(() => {
    settingsSavedToast.value = false;
  }, 2000);
}
</script>

<template>
  <h1 class="text-3xl mb-8">Settings</h1>

  <div class="tabs tabs-border w-lg">
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
