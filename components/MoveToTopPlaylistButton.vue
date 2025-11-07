<script setup lang="ts">
import { Subject } from 'rxjs';

const { optionsButton, moveTopButtonClickedSubject } = defineProps<{
  optionsButton: HTMLElement;
  moveTopButtonClickedSubject: Subject<boolean>;
}>();

function click() {
  optionsButton.click();
  moveTopButtonClickedSubject.next(true);
}
</script>

<template>
  <button id="yt-qa-move-top" class="qa-btn move-btn" @click="click">
    <i class="fa-solid fa-chevron-up fa-lg"></i>
  </button>
</template>

<style scoped></style>
