import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SlideItem, SlidesResponse } from '../types';

export const useSliderStore = defineStore('slider', () => {
  // State
  const slides = ref<SlideItem[]>([]);
  const currentIndex = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);

  // Getters
  const currentSlide = computed(() => slides.value[currentIndex.value] || null);
  const totalSlides = computed(() => slides.value.length);
  const hasSlides = computed(() => slides.value.length > 0);

  // Actions
  async function fetchSlides() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/kiosk/slides');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SlidesResponse = await response.json();
      slides.value = data.slides.sort((a, b) => a.order - b.order);
      lastFetch.value = Date.now();

      // Reset current index if slides changed
      if (currentIndex.value >= slides.value.length) {
        currentIndex.value = 0;
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch slides';
      console.error('Error fetching slides:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function nextSlide() {
    if (slides.value.length === 0) return;

    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
  }

  function previousSlide() {
    if (slides.value.length === 0) return;

    currentIndex.value =
      currentIndex.value === 0 ? slides.value.length - 1 : currentIndex.value - 1;
  }

  function goToSlide(index: number) {
    if (index >= 0 && index < slides.value.length) {
      currentIndex.value = index;
    }
  }

  function reset() {
    slides.value = [];
    currentIndex.value = 0;
    error.value = null;
    lastFetch.value = null;
  }

  return {
    // State
    slides,
    currentIndex,
    loading,
    error,
    lastFetch,

    // Getters
    currentSlide,
    totalSlides,
    hasSlides,

    // Actions
    fetchSlides,
    nextSlide,
    previousSlide,
    goToSlide,
    reset,
  };
});
