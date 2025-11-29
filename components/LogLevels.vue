<script setup lang="ts">
import { LogLevel, logLevelFromStr } from '@/utils/enums/log-level';
import { SettingLogLevels, TemplateLogLevels } from '@/utils/storage/settings-data';

const { logLevels } = defineProps<{ logLevels: SettingLogLevels }>();
const emit = defineEmits({
  logLevelChanged: (_: { loggerName: keyof SettingLogLevels; level: LogLevel }) => true,
});

const logLevelOptions = Object.values(LogLevel).map((level) => ({
  value: level,
  label: level.toUpperCase(),
}));

const templateLoggerNames: TemplateLogLevels = {
  homePage: 'Home page',
  watchVideo: 'Watch video',
  watchPlaylist: 'Watch playlist',
  playlist: 'Playlist',
  settings: 'Settings',
};

function handleLogLevelChange(event: Event, loggerName: keyof SettingLogLevels) {
  const target = event.target as HTMLSelectElement;
  const level = logLevelFromStr(target.value);

  emit('logLevelChanged', { loggerName, level });
}
</script>

<template>
  <div class="bg-base-200 border-base-300 grid grid-cols-2 gap-4 items-center">
    <template v-for="(value, key) in logLevels" :key="key">
      <label :for="key" class="label">{{ templateLoggerNames[key] }}</label>
      <select :id="key" class="select" @change="(event) => handleLogLevelChange(event, key)">
        <option
          v-for="option in logLevelOptions"
          :key="option.value"
          :value="option.value"
          :selected="option.value === value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>
  </div>
</template>

<style scoped></style>
