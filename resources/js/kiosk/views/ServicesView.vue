<template>
  <div class="services-view">
    <!-- Category Selection View -->
    <div v-if="!selectedCategory" class="category-selection">
      <div class="category-bg-pattern"></div>
      <v-container fluid class="category-container">
        <v-row justify="center" align="center" class="category-row">
          <v-col cols="12" class="text-center mb-4">
            <div class="category-header-wrapper">
              <v-icon icon="mdi-hand-pointing-up" size="64" color="white" class="header-icon" />
              <h1 class="category-header">Pilih Jenis Layanan</h1>
              <p class="category-subheader">Sentuh layanan yang Anda butuhkan</p>
            </div>
          </v-col>

          <v-col cols="12" md="5" lg="4" class="category-col">
            <v-card
              class="category-card cetak-surat-card"
              elevation="8"
              @click="selectCategory('cetak-surat')"
              v-ripple
            >
              <div class="card-shine"></div>
              <v-card-text class="category-card-content">
                <div class="icon-wrapper cetak-surat-icon">
                  <v-icon icon="mdi-printer" size="64" color="white" />
                </div>
                <h2 class="category-title">Layanan Cetak Surat</h2>
                <p class="category-description">Cetak berbagai dokumen dan surat keterangan</p>
                <div class="card-arrow">
                  <v-icon icon="mdi-arrow-right-circle" size="32" color="primary" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="5" lg="4" class="category-col">
            <v-card
              class="category-card prioritas-card"
              elevation="8"
              @click="selectCategory('prioritas')"
              v-ripple
            >
              <div class="card-shine"></div>
              <v-card-text class="category-card-content">
                <div class="icon-wrapper prioritas-icon">
                  <v-icon icon="mdi-star" size="64" color="white" />
                </div>
                <h2 class="category-title">Layanan Prioritas</h2>
                <p class="category-description">7 layanan prioritas Kementerian ATR/BPN</p>
                <div class="card-arrow">
                  <v-icon icon="mdi-arrow-right-circle" size="32" color="warning" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Layanan Cetak Surat: Services Grid -->
    <div v-if="selectedCategory === 'cetak-surat'" class="category-content">
      <div class="back-button-wrapper">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-arrow-left"
          elevation="2"
          @click="backToCategories"
        >
          Kembali ke Menu
        </v-btn>
      </div>
      <ServicesGrid @select="handleServiceSelect" />
    </div>

    <!-- Layanan Prioritas: Prioritas Grid -->
    <div v-if="selectedCategory === 'prioritas'" class="category-content">
      <div class="back-button-wrapper">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-arrow-left"
          elevation="2"
          @click="backToCategories"
        >
          Kembali ke Menu
        </v-btn>
      </div>
      <LayananPrioritasGrid @select="handlePrioritasSelect" />
    </div>

    <!-- Print Dialog -->
    <PrintDialog
      v-model:show="showPrintDialog"
      :service="selectedService"
      @printed="handlePrinted"
    />

    <!-- Idle Countdown Indicator -->
    <v-fade-transition>
      <div v-if="showCountdown" class="countdown-badge">
        <v-icon icon="mdi-timer-sand" size="large" />
        <span class="countdown-text">{{ countdownSeconds }}</span>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ServicesGrid from '@/kiosk/components/services/ServicesGrid.vue';
import LayananPrioritasGrid from '@/kiosk/components/services/LayananPrioritasGrid.vue';
import PrintDialog from '@/kiosk/components/services/PrintDialog.vue';
import { useIdleTimeout } from '@/kiosk/composables/useIdleTimeout';
import type { ServiceItem } from '@/kiosk/types';

const router = useRouter();

// Category selection state
type ServiceCategory = 'cetak-surat' | 'prioritas' | null;
const selectedCategory = ref<ServiceCategory>(null);

// Print dialog state
const showPrintDialog = ref(false);
const selectedService = ref<ServiceItem | null>(null);

// Idle timeout - return to attract mode after 15 seconds of inactivity
const { showCountdown, countdownSeconds, resetTimer, stopTimer } = useIdleTimeout(() => {
  returnToAttractMode();
});

// Select category
const selectCategory = (category: ServiceCategory) => {
  console.log('[ServicesView] Category selected:', category);
  selectedCategory.value = category;
  resetTimer();
};

// Back to categories
const backToCategories = () => {
  console.log('[ServicesView] Back to categories');
  selectedCategory.value = null;
  resetTimer();
};

// Return to attract mode (idle timeout)
const returnToAttractMode = () => {
  console.log('[ServicesView] Idle timeout - Returning to attract mode');

  // Clean up state
  showPrintDialog.value = false;
  selectedService.value = null;
  selectedCategory.value = null;

  // Navigate to attract mode
  router.push({ name: 'attract' });
};

// Handle service selection
const handleServiceSelect = (service: ServiceItem) => {
  console.log('[ServicesView] Service selected:', service.title);
  console.log('[ServicesView] Service action:', service.action);

  selectedService.value = service;

  // Handle different service actions
  if (service.action === 'print') {
    console.log('[ServicesView] Opening print dialog...');
    showPrintDialog.value = true;
  } else if (service.action === 'navigate') {
    console.log('[ServicesView] Navigate to:', service.route);
    // Future: Navigate to detail view
  } else if (service.action === 'external') {
    console.log('[ServicesView] Open external:', service.route);
    // Future: Open external link
  } else {
    console.log('[ServicesView] Unknown action or no action defined');
  }

  // Reset idle timer on interaction
  resetTimer();
};

// Handle prioritas service selection
const handlePrioritasSelect = (service: any) => {
  console.log('[ServicesView] Prioritas service selected:', service.title);

  // For now, just show info (can be extended later)
  // You can add navigation or other actions here

  // Reset idle timer on interaction
  resetTimer();
};

// Handle successful print
const handlePrinted = () => {
  console.log('[ServicesView] Document printed');
  showPrintDialog.value = false;

  // Track analytics
  // Future: Send analytics event

  // Reset idle timer
  resetTimer();
};

// Lifecycle: Component mounted
onMounted(() => {
  console.log('[ServicesView] Mounted - Starting idle timer');

  // Start the idle timer when entering services mode
  resetTimer();
});

// Lifecycle: Component unmounted
onUnmounted(() => {
  console.log('[ServicesView] Unmounted - Stopping idle timer');

  // Stop and clean up the idle timer
  stopTimer();
});
</script>

<style scoped>
.services-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fafafa;
}

/* Category Selection */
.category-selection {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c2282a 0%, #8b1d1f 50%, #5a1314 100%);
  position: relative;
  overflow: hidden;
}

.category-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
  animation: bgFloat 20s ease-in-out infinite;
}

@keyframes bgFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, 30px) scale(1.05);
  }
}

.category-container {
  max-width: 1300px;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.category-row {
  min-height: 60vh;
}

.category-header-wrapper {
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-icon {
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.category-header {
  font-size: 3.2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.category-subheader {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  margin: 0;
}

.category-col {
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.category-col:nth-child(2) {
  animation-delay: 0.2s;
}

.category-col:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 28px;
  overflow: hidden;
  background: white;
  min-height: 320px;
  position: relative;
  border: 3px solid transparent;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  transition: all 0.6s;
  opacity: 0;
}

.category-card:hover .card-shine {
  opacity: 1;
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% {
    transform: rotate(45deg) translate(-100%, -100%);
  }
  100% {
    transform: rotate(45deg) translate(100%, 100%);
  }
}

.category-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
}

.category-card:active {
  transform: translateY(-6px) scale(1.01);
}

.cetak-surat-card:hover {
  border-color: #c2282a;
}

.prioritas-card:hover {
  border-color: #ff9800;
}

.category-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 2rem !important;
  text-align: center;
  min-height: 320px;
  height: 320px;
  position: relative;
  z-index: 1;
}

.icon-wrapper {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.cetak-surat-icon {
  background: linear-gradient(135deg, #c2282a 0%, #d63031 100%);
}

.prioritas-icon {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.category-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
}

.category-title {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.category-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.4;
  margin: 0;
  font-weight: 400;
}

.card-arrow {
  margin-top: 0.75rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.category-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(8px);
}

@media (max-width: 768px) {
  .category-header {
    font-size: 2.2rem;
  }

  .category-subheader {
    font-size: 1.1rem;
  }

  .category-card {
    min-height: 280px;
  }

  .category-card-content {
    min-height: 280px;
    height: 280px;
    padding: 2rem 1.5rem !important;
  }

  .icon-wrapper {
    width: 110px;
    height: 110px;
  }

  .icon-wrapper :deep(.v-icon) {
    font-size: 64px !important;
  }

  .category-title {
    font-size: 1.6rem;
  }

  .category-description {
    font-size: 1rem;
  }
}

@media (min-width: 1080px) {
  .category-header {
    font-size: 4rem;
  }

  .category-subheader {
    font-size: 1.6rem;
  }

  .category-card {
    min-height: 360px;
  }

  .category-card-content {
    min-height: 360px;
    height: 360px;
    padding: 3rem 2.5rem !important;
  }

  .icon-wrapper {
    width: 130px;
    height: 130px;
  }

  .icon-wrapper :deep(.v-icon) {
    font-size: 72px !important;
  }

  .category-title {
    font-size: 2.2rem;
  }

  .category-description {
    font-size: 1.15rem;
  }
}

/* Category Content */
.category-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.back-button-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.back-button-wrapper .v-btn {
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(194, 40, 42, 0.25);
  transition: all 0.3s ease;
}

.back-button-wrapper .v-btn:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 20px rgba(194, 40, 42, 0.35);
}

.back-button-wrapper .v-btn:active {
  transform: translateX(-2px);
}

@media (max-width: 768px) {
  .back-button-wrapper {
    top: 15px;
    left: 15px;
  }

  .back-button-wrapper .v-btn {
    font-size: 0.95rem;
    padding: 0.6rem 1.2rem;
  }
}

@media (min-width: 1080px) {
  .back-button-wrapper {
    top: 30px;
    left: 30px;
  }

  .back-button-wrapper .v-btn {
    font-size: 1.3rem;
    padding: 1rem 2rem;
  }
}

/* Countdown badge */
.countdown-badge {
  position: fixed;
  bottom: 100px;
  right: 30px;
  background: linear-gradient(135deg, #c2282a 0%, #8b1d1f 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 60px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  box-shadow:
    0 8px 24px rgba(194, 40, 42, 0.4),
    0 0 0 4px rgba(194, 40, 42, 0.1);
  animation: countdownPulse 1.5s ease-in-out infinite;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.countdown-text {
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 50px;
  text-align: center;
}

.countdown-badge :deep(.v-icon) {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes countdownPulse {
  0% {
    transform: scale(1);
    box-shadow:
      0 8px 24px rgba(194, 40, 42, 0.4),
      0 0 0 4px rgba(194, 40, 42, 0.1);
  }
  50% {
    transform: scale(1.08);
    box-shadow:
      0 12px 32px rgba(194, 40, 42, 0.5),
      0 0 0 8px rgba(194, 40, 42, 0.15);
  }
  100% {
    transform: scale(1);
    box-shadow:
      0 8px 24px rgba(194, 40, 42, 0.4),
      0 0 0 4px rgba(194, 40, 42, 0.1);
  }
}

/* Custom scrollbar for kiosk */
.services-view::-webkit-scrollbar {
  width: 12px;
}

.services-view::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.services-view::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.services-view::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Disable text selection */
.services-view {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Smooth transitions */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}
</style>
