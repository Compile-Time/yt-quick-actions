<script setup lang="ts">
import { Subject } from 'rxjs';
import MoveToTopPlaylistButton from '@/components/MoveToTopPlaylistButton.vue';
import MoveToBottomPlaylistButton from '@/components/MoveToBottomPlaylistButton.vue';

const { optionsButton, moveTopButtonClickedSubject, moveBottomButtonClickedSubject } = defineProps<{
  optionsButton: HTMLElement;
  moveTopButtonClickedSubject: Subject<boolean>;
  moveBottomButtonClickedSubject: Subject<boolean>;
}>();
</script>

<template>
  <div class="qa-drag-container-overlay">
    <MoveToTopPlaylistButton
      class="flex-auto"
      :options-button="optionsButton"
      :move-top-button-clicked-subject="moveTopButtonClickedSubject"
    />
    <MoveToBottomPlaylistButton
      class="flex-auto"
      :options-button="optionsButton"
      :move-bottom-button-clicked-subject="moveBottomButtonClickedSubject"
    />
  </div>
</template>

<style scoped></style>
