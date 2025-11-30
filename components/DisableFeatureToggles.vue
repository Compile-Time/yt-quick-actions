<script setup lang="ts">
import { SettingFeatures, SettingFeaturesValues, TemplateFeatures } from '@/utils/storage';
import { watchDebounced } from '@vueuse/shared';
import ToggleComponent from '@/components/ToggleComponent.vue';

const props = defineProps<{ featureToggles: SettingFeatures<boolean> }>();
const featureToggles = reactive<SettingFeatures<boolean>>(props.featureToggles);
const featureSections = computed(() => Object.keys(featureToggles));

const sectionTitles: Record<keyof SettingFeatures<boolean>, string> = {
  homePage: 'Home page',
  watchVideo: 'Watch video',
  watchPlaylist: 'Watch playlist',
  playlist: 'Playlist',
};
const templateFeatureToggles: TemplateFeatures = {
  homePage: {
    disableWatchLater: 'Disable watch later button',
  },
  watchPlaylist: {
    disableRemove: 'Disable remove button',
    disableWatchLater: 'Disable watch later button',
    disableScrollTopBottom: 'Disable scroll to top or bottom buttons',
  },
  playlist: {
    disableRemove: 'Disable remove button',
    disableMoveTopBottom: 'Disable move to top or bottom buttons',
    disableScrollTopBottom: 'Disable scroll to top or bottom buttons',
  },
  watchVideo: {
    disableWatchLater: 'Disable watch later button',
  },
};

const emit = defineEmits({
  change: (_: SettingFeatures<boolean>) => true,
});

watchDebounced(
  [featureToggles],
  () => {
    handleInputChange();
  },
  {
    debounce: 2000,
  },
);

function handleInputChange() {
  emit('change', toRaw(featureToggles));
}

function updateFeatureToggles(
  section: keyof SettingFeatures<boolean>,
  element: keyof SettingFeaturesValues,
  value: boolean,
) {
  // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
  featureToggles[section][element] = value;
}

function toggleSection(section: keyof SettingFeatures<string>, value: boolean) {
  Object.keys(featureToggles[section]).forEach((key) => {
    // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
    featureToggles[section][key] = value;
  });
}

function getInitialSectionToggleValue(section: keyof SettingFeatures<boolean>) {
  return Object.values(featureToggles[section]).every((value) => value);
}
</script>

<template>
  <template v-for="(sectionValue, sectionKey, sectionIterationIndex) in props.featureToggles" :key="sectionKey">
    <div class="flex gap-4 mb-4">
      <p class="">{{ sectionTitles[sectionKey] }}</p>

      <ToggleComponent
        :toggled="getInitialSectionToggleValue(sectionKey)"
        @checked="(checkedValue) => toggleSection(sectionKey, checkedValue)"
      ></ToggleComponent>
    </div>

    <div class="bg-base-200 border-base-300 features-grid gap-4">
      <template v-for="(value, key) in sectionValue" :key="key">
        <label class="label whitespace-normal">{{ templateFeatureToggles[sectionKey][key] }}</label>

        <ToggleComponent
          :toggled="value"
          class="ms-auto"
          @checked="updateFeatureToggles(sectionKey, key, $event)"
        ></ToggleComponent>
      </template>
    </div>

    <div v-if="featureSections.length - 1 !== sectionIterationIndex" class="divider"></div>
  </template>
</template>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.5fr;
}
</style>
