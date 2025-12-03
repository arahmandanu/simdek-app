<template>
  <div class="video-slide">
    <video
      ref="videoElement"
      class="video-player"
      :src="slide.url"
      autoplay
      muted
      playsinline
      preload="auto"
    >
      <source :src="slide.url" type="video/mp4" />
      Browser Anda tidak mendukung video HTML5.
    </video>

    <MediaLoadingState
      :is-loading="isLoading"
      :has-error="hasError"
      error-message="Video tidak dapat dimuat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SlideItem } from '@/kiosk/types';
import { useMediaLoader } from '@/kiosk/composables/useMediaLoader';
import { useVideoPlayer } from '@/kiosk/composables/useVideoPlayer';
import MediaLoadingState from './MediaLoadingState.vue';

interface Props {
  slide: SlideItem;
}

interface Emits {
  (e: 'ended'): void;
  (e: 'duration-detected', duration: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const videoElement = ref<HTMLVideoElement | null>(null);
const { isLoading, hasError, handleLoad, handleError } = useMediaLoader();

const { setupListeners } = useVideoPlayer(videoElement, props.slide.url, {
  onEnded: () => emit('ended'),
  onError: (error) => handleError(error),
  onDurationDetected: (duration) => emit('duration-detected', duration),
  onReady: handleLoad,
});

onMounted(() => {
  setupListeners();
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
