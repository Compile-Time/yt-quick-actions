<script setup lang="ts">
const { scrollContainer, scrollWindow } = defineProps<{
  scrollContainer: HTMLElement;
  scrollWindow: boolean;
  pillLook: boolean;
}>();

function scrollToTop() {
  const scrollable = scrollWindow ? window : scrollContainer;
  scrollable.scrollTo({
    behavior: 'smooth',
    top: 0,
  });
}

function scrollToBottom() {
  const scrollable = scrollWindow ? window : scrollContainer;
  scrollable.scrollTo({
    behavior: 'smooth',
    top: scrollContainer.scrollHeight,
  });
}
</script>

<template>
  <div class="qa-scroll-container">
    <button class="qa-btn" :class="{ 'qa-btn-pill': pillLook }" @click="scrollToTop">
      <i class="fa-solid fa-arrows-up-to-line fa-lg"></i>
    </button>

    <button class="qa-btn" :class="{ 'qa-btn-pill': pillLook }" @click="scrollToBottom">
      <i class="fa-solid fa-arrows-down-to-line fa-lg"></i>
    </button>
  </div>
</template>

<style scoped>
.qa-scroll-container {
  display: flex;
  gap: 1rem;
}

@media (max-width: 1080px) {
  .qa-scroll-container {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 791px) {
  .qa-scroll-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
