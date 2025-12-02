<template>
  <div class="video-slide">
    <video
      ref="videoElement"
      class="video-player"
      :src="slide.url"
      autoplay
      muted
      playsinline
      @ended="handleVideoEnd"
      @error="handleError"
    >
      <source :src="slide.url" type="video/mp4" />
      Browser Anda tidak mendukung video HTML5.
    </video>

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
        <p class="text-h6 mt-4">Video tidak dapat dimuat</p>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { SlideItem } from '@/kiosk/types';

interface Props {
  slide: SlideItem;
}

interface Emits {
  (e: 'ended'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const videoElement = ref<HTMLVideoElement | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

const handleVideoEnd = () => {
  emit('ended');
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error('Failed to load video:', props.slide.url);
};

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.addEventListener('loadeddata', () => {
      isLoading.value = false;
    });

    videoElement.value.addEventListener('canplay', () => {
      isLoading.value = false;
    });
  }
});

onUnmounted(() => {
  if (videoElement.value) {
    videoElement.value.pause();
    videoElement.value.src = '';
  }
});
</script>

<style scoped>
.video-slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.video-player {
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
</style>
