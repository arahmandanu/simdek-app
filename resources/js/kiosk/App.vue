<template>
  <v-app>
    <!-- App Bar -->
    <KioskAppBar
      :mode="kioskMode"
      :logo-url="config.theme.logo"
      :header-title="config.theme.headerTitle"
      @switch-mode="handleModeSwitch"
    />

    <!-- Main Content Area -->
    <v-main class="kiosk-main">
      <v-container fluid class="pa-0 fill-height">
        <!-- Attract Mode: Media Slider -->
        <v-fade-transition mode="out-in" :duration="{ enter: 300, leave: 300 }">
          <div v-if="showSlider" key="attract" class="content-view slider-view">
            <MediaSlider height="90vh" :auto-advance="true" />
          </div>

          <!-- Services Mode: Services Grid -->
          <div v-else-if="showServices" key="services" class="content-view services-view">
            <ServicesGrid @select="handleServiceSelect" />
          </div>
        </v-fade-transition>
      </v-container>
    </v-main>

    <!-- Footer -->
    <KioskFooter />

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
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import KioskAppBar from '@/kiosk/components/layout/KioskAppBar.vue';
import KioskFooter from '@/kiosk/components/layout/KioskFooter.vue';
import MediaSlider from '@/kiosk/components/slider/MediaSlider.vue';
import ServicesGrid from '@/kiosk/components/services/ServicesGrid.vue';
import PrintDialog from '@/kiosk/components/services/PrintDialog.vue';
import { useConfigStore } from '@/kiosk/stores/config';
import { useSliderStore } from '@/kiosk/stores/slider';
import { useServicesStore } from '@/kiosk/stores/services';
import { useOfflineSync } from '@/kiosk/composables/useOfflineSync';
import { useIdleTimeout } from '@/kiosk/composables/useIdleTimeout';
import type { KioskMode, ServiceItem } from '@/kiosk/types';

// Stores
const configStore = useConfigStore();
const sliderStore = useSliderStore();
const servicesStore = useServicesStore();

const { config } = storeToRefs(configStore);

// Offline sync
const { syncStore, startAutoSync } = useOfflineSync();

// Kiosk mode state
const kioskMode = ref<KioskMode>('attract');

// Print dialog state
const showPrintDialog = ref(false);
const selectedService = ref<ServiceItem | null>(null);

// Computed properties for view visibility
const showSlider = computed(() => kioskMode.value === 'attract');
const showServices = computed(() => kioskMode.value === 'services');

// Idle timeout - return to attract mode after 60 seconds
const { showCountdown, countdownSeconds, resetTimer } = useIdleTimeout(() => {
  returnToAttractMode();
});

// Handle mode switching
const handleModeSwitch = (newMode: KioskMode) => {
  kioskMode.value = newMode;
  console.log(`[Kiosk] Mode switched to: ${newMode}`);

  // Reset idle timer when switching to services mode
  if (newMode === 'services') {
    resetTimer();
  }
};

// Return to attract mode (idle timeout or manual)
const returnToAttractMode = () => {
  kioskMode.value = 'attract';
  showPrintDialog.value = false;
  selectedService.value = null;

  // Reset slider to first slide (don't clear slides)
  sliderStore.goToSlide(0);

  console.log('[Kiosk] Returned to attract mode');
};

// Handle service selection
const handleServiceSelect = (service: ServiceItem) => {
  console.log('[Kiosk] Service selected:', service.title);

  selectedService.value = service;

  // Handle different service actions
  if (service.action === 'print') {
    showPrintDialog.value = true;
  } else if (service.action === 'navigate') {
    // Future: Navigate to detail view
    console.log('[Kiosk] Navigate to:', service.route);
  } else if (service.action === 'external') {
    // Future: Open external link
    console.log('[Kiosk] Open external:', service.route);
  }

  // Reset idle timer on interaction
  resetTimer();
};

// Handle successful print
const handlePrinted = () => {
  console.log('[Kiosk] Document printed');
  showPrintDialog.value = false;

  // Track analytics
  // Future: Send analytics event

  // Reset idle timer
  resetTimer();
};

// Initialize all stores with offline sync
async function initializeStores() {
  try {
    console.log('[Kiosk] Initializing stores...');

    // Sync all stores in parallel with offline support
    await Promise.all([
      syncStore('config', '/api/kiosk/config').then(() => configStore.fetchConfig()),
      syncStore('slides', '/api/kiosk/slides').then(() => sliderStore.fetchSlides()),
      syncStore('services', '/api/kiosk/services').then(() => servicesStore.fetchServices()),
    ]);

    console.log('[Kiosk] All stores initialized successfully');
  } catch (error) {
    console.error('[Kiosk] Failed to initialize stores:', error);

    // Try direct fetch as fallback
    try {
      await Promise.all([
        configStore.fetchConfig().catch((err) => console.error('Config fetch failed:', err)),
        sliderStore.fetchSlides().catch((err) => console.error('Slides fetch failed:', err)),
        servicesStore.fetchServices().catch((err) => console.error('Services fetch failed:', err)),
      ]);
    } catch (fallbackError) {
      console.error('[Kiosk] Fallback fetch also failed:', fallbackError);
    }
  }
}

// Setup auto-sync (every 5 minutes)
function setupAutoSync() {
  startAutoSync(async () => {
    console.log('[Kiosk] Auto-sync triggered');
    await Promise.all([
      configStore.fetchConfig().catch((err) => console.error('Config sync failed:', err)),
      sliderStore.fetchSlides().catch((err) => console.error('Slides sync failed:', err)),
      servicesStore.fetchServices().catch((err) => console.error('Services sync failed:', err)),
    ]);
  });
}

// Initialize on mount
onMounted(async () => {
  await initializeStores();
  setupAutoSync();
});
</script>

<style scoped>
.kiosk-main {
  padding-top: 5vh;
  padding-bottom: 5vh;
  height: 100vh;
  overflow: hidden;
}

.content-view {
  width: 100%;
  height: 90vh;
}

.slider-view {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.services-view {
  overflow-y: auto;
  background-color: #fafafa;
}

/* Countdown badge */
.countdown-badge {
  position: fixed;
  bottom: 100px;
  right: 30px;
  background: rgba(194, 40, 42, 0.95);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: pulse 1s infinite;
}

.countdown-text {
  font-size: 2rem;
  font-weight: bold;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Custom scrollbar for kiosk */
.kiosk-main :deep(*::-webkit-scrollbar) {
  width: 12px;
}

.kiosk-main :deep(*::-webkit-scrollbar-track) {
  background: #f1f1f1;
}

.kiosk-main :deep(*::-webkit-scrollbar-thumb) {
  background: #888;
  border-radius: 6px;
}

.kiosk-main :deep(*::-webkit-scrollbar-thumb:hover) {
  background: #555;
}

/* Disable text selection */
.content-view {
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
