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
  <div class="flex justify-end">
    <div class="flex">
      <button class="qa-btn" :class="{ 'qa-btn-pill': pillLook }" @click="scrollToTop">
        <i class="fa-solid fa-arrows-up-to-line fa-lg"></i>
      </button>

      <button class="qa-btn" :class="{ 'qa-btn-pill': pillLook }" @click="scrollToBottom">
        <i class="fa-solid fa-arrows-down-to-line fa-lg"></i>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
