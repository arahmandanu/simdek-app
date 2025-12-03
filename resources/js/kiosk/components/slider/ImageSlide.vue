<template>
  <div class="image-slide">
    <img
      :src="slide.url"
      :alt="slide.title || 'Slide image'"
      class="slide-image"
      @load="handleLoad"
      @error="handleImageError"
    />

    <MediaLoadingState
      :is-loading="isLoading"
      :has-error="hasError"
      error-message="Gambar tidak dapat dimuat"
    />
  </div>
</template>

<script setup lang="ts">
import type { SlideItem } from '@/kiosk/types';
import { useMediaLoader } from '@/kiosk/composables/useMediaLoader';
import MediaLoadingState from './MediaLoadingState.vue';

interface Props {
  slide: SlideItem;
}

defineProps<Props>();

const { isLoading, hasError, handleLoad, handleError } = useMediaLoader();

const handleImageError = () => {
  handleError('Failed to load image');
};
</script>

<style scoped>
.image-slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.slide-image {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  z-index: 5;
}

.title-overlay {
  position: absolute;
  bottom: 4rem;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  text-align: center;
  z-index: 10;
}

.title-overlay h3 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin: 0;
}
</style>
