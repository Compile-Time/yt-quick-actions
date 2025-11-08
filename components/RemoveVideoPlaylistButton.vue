<script setup lang="ts">
import { Subject } from 'rxjs';

const { optionsButton, removeButtonClickedSubject } = defineProps<{
  optionsButton: HTMLElement;
  removeButtonClickedSubject: Subject<boolean>;
}>();

function click() {
  optionsButton.click();
  removeButtonClickedSubject.next(true);
}
</script>

<template>
  <button id="yt-qa-remove-button" class="qa-btn remove-btn" @click="click">
    <i class="fa-solid fa-trash fa-lg"></i>
  </button>
</template>

<style scoped></style>
