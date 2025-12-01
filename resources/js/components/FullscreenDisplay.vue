<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Mock images - replace with actual images later
const images = ref([
  'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
]);

const currentImageIndex = ref(0);

// Auto-rotate images every 5 seconds
onMounted(() => {
  setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
  }, 5000);
});
</script>

<template>
  <v-container fluid class="pa-0 fill-height">
    <v-carousel
      v-model="currentImageIndex"
      hide-delimiters
      show-arrows="hover"
      cycle
      interval="5000"
      height="100%"
      class="fullscreen-carousel"
    >
      <v-carousel-item v-for="(image, index) in images" :key="index" :src="image" cover>
        <div class="overlay-content d-flex align-center justify-center">
          <div class="text-center text-white">
            <h1 class="text-h2 font-weight-bold mb-4 text-shadow">Selamat Datang</h1>
            <p class="text-h5 text-shadow">Sistem Informasi Pelayanan Publik Terpadu</p>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<style scoped>
.fullscreen-carousel {
  width: 100%;
  height: 100%;
}

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
</style>
