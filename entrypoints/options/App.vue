<script lang="ts" setup>
const numbers = ref([1, 2, 3]);
</script>

<template>
  <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
  <button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
    Button
  </button>
  <ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
      popover id="popover-1" style="position-anchor:--anchor-1">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
  <p v-for="number in numbers">{{number}}</p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
