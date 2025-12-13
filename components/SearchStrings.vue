<script setup lang="ts">
import { SettingSearchStrings, SettingSearchStringValues } from '@/utils/storage';
import { watchDebounced } from '@vueuse/shared';
import useI18n from '@/composables/useI18n';

const props = defineProps<{ searchStrings: SettingSearchStrings }>();
const searchStrings = reactive<SettingSearchStrings>(props.searchStrings);
const searchStringSections = computed(() => Object.keys(searchStrings));

const { t } = useI18n();

const emit = defineEmits({
  change: (_: SettingSearchStrings) => true,
});

watchDebounced(
  [searchStrings],
  () => {
    handleInputChange();
  },
  {
    debounce: 2000,
  },
);

function handleInputChange() {
  emit('change', toRaw(searchStrings));
}

function updateSearchString(
  section: keyof SettingSearchStrings,
  element: keyof SettingSearchStringValues,
  value: string,
) {
  // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
  searchStrings[section][element] = value;
}
</script>

<template>
  <template v-for="(sectionObject, sectionKey, sectionIterationIndex) in props.searchStrings" :key="sectionKey">
    <p class="">{{ t(`options.searchStrings.${sectionKey}.title`) }}</p>

    <div class="bg-base-200 border-base-300 grid grid-cols-2 gap-4 items-center">
      <template v-for="(value, key) in sectionObject" :key="key">
        <label class="label whitespace-normal">{{
          t(`options.searchStrings.${sectionKey}.field.${key as string}`)
        }}</label>
        <input
          type="text"
          class="input"
          :value="value"
          :placeholder="t(`options.searchStrings.${sectionKey}.placeholder.${key as string}`)"
          @input="(event) => updateSearchString(sectionKey, key, (event.target as HTMLInputElement).value)"
          @change="handleInputChange"
        />
      </template>
    </div>

    <div v-if="searchStringSections.length - 1 !== sectionIterationIndex" class="divider"></div>
  </template>
</template>

<style scoped></style>
