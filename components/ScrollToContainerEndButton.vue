<script setup lang="ts">
const { scrollContainer } = defineProps<{
  scrollContainer: HTMLElement;
}>();

function click() {
  window.scrollTo({
    behavior: 'smooth',
    top: scrollContainer.scrollHeight,
  });
}
</script>

<template>
  <div class="flex justify-end sticky">
    <button class="qa-btn qa-btn-pill" @click="click">
      <i class="fa-solid fa-arrows-down-to-line fa-lg"></i>
    </button>
  </div>
</template>

<style scoped></style>
