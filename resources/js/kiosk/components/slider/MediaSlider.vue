<template>
  <div class="media-slider" :style="{ height }">
    <v-fade-transition mode="out-in">
      <div v-if="!sliderStore.hasSlides" class="slider-empty">
        <v-icon size="80" color="grey-lighten-1">mdi-image-multiple</v-icon>
        <p class="text-h5 text-grey-lighten-1 mt-4">Tidak ada konten</p>
      </div>

      <div
        v-else-if="sliderStore.currentSlide"
        :key="sliderStore.currentSlide.id"
        class="slide-container"
      >
        <!-- Video Slide -->
        <VideoSlide
          v-if="sliderStore.currentSlide.type === 'video'"
          :slide="sliderStore.currentSlide"
          @ended="handleSlideEnd"
        />

        <!-- Image Slide -->
        <ImageSlide
          v-else-if="sliderStore.currentSlide.type === 'image'"
          :slide="sliderStore.currentSlide"
        />

        <!-- PDF Slide -->
        <PdfSlide
          v-else-if="sliderStore.currentSlide.type === 'pdf'"
          :slide="sliderStore.currentSlide"
        />
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSliderStore } from '@/kiosk/stores/slider';
import VideoSlide from './VideoSlide.vue';
import ImageSlide from './ImageSlide.vue';
import PdfSlide from './PdfSlide.vue';

interface Props {
  height?: string;
  autoAdvance?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: '85vh',
  autoAdvance: true,
});

const sliderStore = useSliderStore();
const { currentSlide } = storeToRefs(sliderStore);

let autoAdvanceTimer: number | null = null;

// Handle slide end (for videos and auto-advance)
const handleSlideEnd = () => {
  if (props.autoAdvance) {
    sliderStore.nextSlide();
  }
};

// Start auto-advance timer for images and PDFs
const startAutoAdvance = () => {
  if (!props.autoAdvance || !currentSlide.value) return;

  // Clear existing timer
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
  }

  // Only set timer for images and PDFs (videos handle their own timing)
  if (currentSlide.value.type === 'image' || currentSlide.value.type === 'pdf') {
    const duration =
      currentSlide.value.duration || (currentSlide.value.type === 'pdf' ? 15000 : 10000);
    autoAdvanceTimer = window.setTimeout(() => {
      sliderStore.nextSlide();
    }, duration);
  }
};

// Watch for slide changes to restart auto-advance
watch(currentSlide, () => {
  startAutoAdvance();
});

onMounted(() => {
  // Fetch slides if not already loaded
  if (!sliderStore.hasSlides) {
    sliderStore.fetchSlides();
  }

  // Start auto-advance
  startAutoAdvance();
});

onUnmounted(() => {
  // Clean up timer
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
  }
});
</script>

<style scoped>
.media-slider {
  position: relative;
  width: 100%;
  background-color: #000;
  overflow: hidden;
}

.slider-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.slide-container {
  width: 100%;
  height: 100%;
}

/* Transition animations */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}
</style>
