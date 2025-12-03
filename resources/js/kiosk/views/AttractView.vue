<template>
  <div class="attract-view">
    <!-- Attract Mode: Media Slider -->
    <MediaSlider height="90vh" :auto-advance="true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import MediaSlider from '@/kiosk/components/slider/MediaSlider.vue';
import { useSliderStore } from '@/kiosk/stores/slider';

const sliderStore = useSliderStore();

// Lifecycle: Component mounted
onMounted(() => {
  console.log('[AttractView] Mounted - Starting slideshow');

  // Reset to first slide when entering attract mode
  sliderStore.goToSlide(0);
});

// Lifecycle: Component unmounted
onUnmounted(() => {
  console.log('[AttractView] Unmounted - Leaving slideshow');
});
</script>

<style scoped>
.attract-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
}

/* Disable text selection */
.attract-view {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
