<template>
  <div class="pdf-slide">
    <iframe
      :src="pdfUrl"
      class="pdf-iframe"
      frameborder="0"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Loading indicator -->
    <v-fade-transition>
      <div v-if="isLoading" class="loading-overlay">
        <v-progress-circular indeterminate size="64" color="white" />
        <p class="text-h6 mt-4">Memuat dokumen...</p>
      </div>
    </v-fade-transition>

    <!-- Error state -->
    <v-fade-transition>
      <div v-if="hasError" class="error-overlay">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
        <p class="text-h6 mt-4">Dokumen tidak dapat dimuat</p>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SlideItem } from '@/kiosk/types';

interface Props {
  slide: SlideItem;
}

const props = defineProps<Props>();

const isLoading = ref(true);
const hasError = ref(false);

// Add URL parameters to hide PDF toolbar and show fullscreen
const pdfUrl = computed(() => {
  const url = props.slide.url;
  const separator = url.includes('?') ? '&' : '#';
  return `${url}${separator}toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit`;
});

const handleLoad = () => {
  isLoading.value = false;
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error('Failed to load PDF');
};
</script>

<style scoped>
.pdf-slide {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.pdf-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  object-fit: fill;
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
</style>
