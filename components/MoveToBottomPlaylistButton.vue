<script setup lang="ts">
import { Subject } from 'rxjs';

const { optionsButton, moveBottomButtonClickedSubject } = defineProps<{
  optionsButton: HTMLElement;
  moveBottomButtonClickedSubject: Subject<boolean>;
}>();

function click() {
  optionsButton.click();
  moveBottomButtonClickedSubject.next(true);
}
</script>

<template>
  <button id="yt-qa-move-bottom" class="qa-btn move-btn" @click="click">
    <i class="fa-solid fa-chevron-down fa-lg"></i>
  </button>
</template>

<style scoped></style>
