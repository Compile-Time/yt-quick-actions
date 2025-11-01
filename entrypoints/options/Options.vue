<script lang="ts" setup>
import { createLogger } from '@/utils/logging/log-provider';
import { LogLevel, logLevelFromStr } from '@/utils/enums/log-level';
import { ref } from 'vue';
import { SETTING_LOG_LEVELS, SettingLogLevels } from '@/utils/storage/settings-data';

const logger = createLogger('settings');

const logLevelOptions = Object.values(LogLevel).map((level) => ({
  value: level,
  label: level.toUpperCase(),
}));

const loggers = ref<SettingLogLevels>({
  homePage: LogLevel.WARN,
  watchVideo: LogLevel.WARN,
  watchPlaylist: LogLevel.WARN,
  playlist: LogLevel.WARN,
});

const templateLoggerNames = {
  homePage: 'Home page',
  watchVideo: 'Watch video',
  watchPlaylist: 'Watch playlist',
  playlist: 'Playlist',
};

storage.getItem<SettingLogLevels>(SETTING_LOG_LEVELS).then((levels) => {
  if (levels) {
    loggers.value = levels;
    logger.debug(`Log level loaded "${levels}" from storage`);
  }
});

function handleLogLevelChange(event: Event, loggerName: keyof SettingLogLevels) {
  const target = event.target as HTMLSelectElement;
  const level = logLevelFromStr(target.value);

  logger.setLevel(level);
  logger.debug(`Log level changed to "${level}"`);

  loggers.value[loggerName] = level;
  storage.setItem<SettingLogLevels>(SETTING_LOG_LEVELS, {
    ...loggers.value,
    [loggerName]: level,
  });
}
</script>

<template>
  <h1 class="text-3xl">Settings</h1>

  <h2 class="text-2xl">Log levels</h2>

  <div class="grid grid-cols-2 gap-4 items-center">
    <template v-for="(value, key) in loggers">
      <label :for="key">{{ templateLoggerNames[key] }}</label>
      <select class="select" @change="(event) => handleLogLevelChange(event, key)" :id="key">
        <option v-for="option in logLevelOptions" :value="option.value" :selected="option.value === value">
          {{ option.label }}
        </option>
      </select>
    </template>
  </div>
</template>

<style scoped></style>
