<script setup lang="ts">
import TopNavBar from './TopNavBar.vue';
import FullscreenDisplay from './FullscreenDisplay.vue';
import RunningTextFooter from './RunningTextFooter.vue';
</script>

<template>
  <v-app>
    <top-nav-bar />

    <v-main class="main-content">
      <fullscreen-display />
    </v-main>

    <running-text-footer />
  </v-app>
</template>

<style scoped>
.main-content {
  height: calc(100vh - 80px - 60px);
}
</style>
