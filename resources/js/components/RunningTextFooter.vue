<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const runningTexts = ref([
  'Selamat Datang di Kantor Pemerintah Daerah',
  'Jam Pelayanan: Senin - Jumat, 08:00 - 16:00 WIB',
  'Mohon Siapkan Dokumen yang Diperlukan',
  'Layanan Terbaik untuk Masyarakat',
  'Bersama Membangun Daerah yang Lebih Baik',
]);

const scrollPosition = ref(0);
const animationId = ref<number | null>(null);

const fullText = runningTexts.value.join('  •  ') + '  •  ';

const animateText = () => {
  scrollPosition.value += 0.5;
  if (scrollPosition.value >= fullText.length * 20) {
    scrollPosition.value = 0;
  }
  animationId.value = requestAnimationFrame(animateText);
};

onMounted(() => {
  animateText();
});

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});
</script>

<template>
  <v-footer color="primary" app height="60" class="footer-container">
    <v-container fluid class="pa-0">
      <div class="running-text-wrapper">
        <div class="running-text" :style="{ transform: `translateX(-${scrollPosition}px)` }">
          {{ fullText.repeat(3) }}
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-container {
  overflow: hidden;
  position: relative;
}

.running-text-wrapper {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.running-text {
  display: inline-block;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  padding-left: 100%;
  white-space: nowrap;
  will-change: transform;
}
</style>
