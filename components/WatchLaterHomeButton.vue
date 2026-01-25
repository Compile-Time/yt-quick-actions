<script setup lang="ts">
import { Subject } from 'rxjs';

const { homeItemDiv, watchLaterClickSubject } = defineProps<{
  homeItemDiv: HTMLElement;
  watchLaterClickSubject: Subject<HTMLElement>;
}>();

function click() {
  watchLaterClickSubject.next(homeItemDiv);
}
</script>

<template>
  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
    <button id="qa-watch-later-home-button" class="qa-btn" @click="click">
      <i class="fa-solid fa-clock fa-lg"></i>
    </button>
  </div>
</template>

<style scoped></style>
