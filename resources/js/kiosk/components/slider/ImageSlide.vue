<template>
  <div class="image-slide">
    <img
      :src="slide.url"
      :alt="slide.title || 'Slide image'"
      class="slide-image"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Loading indicator -->
    <v-fade-transition>
      <div v-if="isLoading" class="loading-overlay">
        <v-progress-circular indeterminate size="64" color="white" />
      </div>
    </v-fade-transition>

    <!-- Error state -->
    <v-fade-transition>
      <div v-if="hasError" class="error-overlay">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
        <p class="text-h6 mt-4">Gambar tidak dapat dimuat</p>
      </div>
    </v-fade-transition>

    <!-- Title overlay (if title exists) -->
    <v-fade-transition>
      <div v-if="slide.title && !isLoading && !hasError" class="title-overlay">
        <h3 class="text-h5">{{ slide.title }}</h3>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SlideItem } from '@/kiosk/types';

interface Props {
  slide: SlideItem;
}

defineProps<Props>();

const isLoading = ref(true);
const hasError = ref(false);

const handleLoad = () => {
  isLoading.value = false;
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error('Failed to load image');
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
