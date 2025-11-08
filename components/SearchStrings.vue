<script setup lang="ts">
import { SettingSearchStrings, SettingSearchStringValues, TemplateSearchStrings } from '@/utils/storage/settings-data';
import { watchDebounced } from '@vueuse/shared';

const props = defineProps<{ searchStrings: SettingSearchStrings }>();
const searchStrings = reactive<SettingSearchStrings>(props.searchStrings);
const searchStringPages = computed(() => Object.keys(searchStrings));

const pageTitles: Record<keyof SettingSearchStrings, string> = {
  homePage: 'Home page',
  watchVideo: 'Watch video',
  watchPlaylist: 'Watch playlist',
  playlist: 'Playlist',
};
const templateSearchStringText: TemplateSearchStrings = {
  homePage: {
    watchLaterEntry: 'Popup watch later item',
  },
  watchPlaylist: {
    removeEntry: 'Popup remove item',
    watchLaterEntry: 'Popup watch later item',
  },
  playlist: {
    removeEntry: 'Popup remove item',
    moveToBottomEntry: 'Popup move to bottom item',
    moveToTopEntry: 'Popup move to top item',
  },
  watchVideo: {
    videoSaveButton: 'Save button',
    watchLaterEntry: 'Popup watch later item',
  },
};

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

function updateSearchString(page: keyof SettingSearchStrings, element: keyof SettingSearchStringValues, value: string) {
  // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
  searchStrings[page][element] = value;
}
</script>

<template>
  <template v-for="(pageValue, pageKey, pageIterationIndex) in props.searchStrings" :key="pageKey">
    <p class="">{{ pageTitles[pageKey] }}</p>

    <div class="bg-base-200 border-base-300 grid grid-cols-2 gap-4 items-center">
      <template v-for="(value, key) in pageValue" :key="key">
        <label class="label whitespace-normal">{{ templateSearchStringText[pageKey][key] }}</label>
        <input
          type="text"
          class="input"
          :value="value"
          @input="(event) => updateSearchString(pageKey, key, (event.target as HTMLInputElement).value)"
          @change="handleInputChange"
        />
      </template>
    </div>

    <div v-if="searchStringPages.length - 1 !== pageIterationIndex" class="divider"></div>
  </template>
</template>

<style scoped></style>
