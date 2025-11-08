<script setup lang="ts">
import { Subject } from 'rxjs';

const { popupTrigger, subjectTrigger } = defineProps<{
  popupTrigger: HTMLElement;
  subjectTrigger: Subject<boolean>;
}>();

function click() {
  popupTrigger.click();
  subjectTrigger.next(true);
}
</script>

<template>
  <button id="qa-watch-later-video-button" class="qa-btn qa-btn-pill" @click="click">
    <i class="fa-solid fa-clock fa-lg"></i>
  </button>
</template>

<style scoped></style>
