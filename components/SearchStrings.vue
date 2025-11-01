<script setup lang="ts">
import { SettingSearchStrings } from '@/utils/storage/settings-data';
import { watchDebounced } from '@vueuse/shared';

const props = defineProps<{ searchStrings: SettingSearchStrings }>();

const emit = defineEmits({
  change: (_: SettingSearchStrings) => true,
});

watchDebounced(
  [props.searchStrings],
  () => {
    handleInputChange();
  },
  {
    debounce: 2000,
  },
);

function handleInputChange() {
  emit('change', { ...props.searchStrings });
}
</script>

<template>
  <div class="bg-base-200 border-base-300 grid grid-cols-2 gap-4 items-center">
    <template v-for="(value, key) in props.searchStrings">
      <label class="label">Playlist remove entry</label>
      <input
        type="text"
        class="input"
        placeholder="Watch later"
        :value="value"
        @input="(event) => (props.searchStrings[key] = (event.target as HTMLInputElement).value)"
        @change="handleInputChange"
      />
    </template>
  </div>
</template>

<style scoped></style>
