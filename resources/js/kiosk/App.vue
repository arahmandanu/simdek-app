<template>
  <v-app>
    <!-- App Bar -->
    <KioskAppBar
      :mode="currentMode"
      :logo-url="config.theme.logo"
      :header-title="config.theme.headerTitle"
      @switch-mode="handleModeSwitch"
    />

    <!-- Main Content Area with Router View -->
    <v-main class="kiosk-main">
      <v-container fluid class="pa-0 fill-height">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in" :duration="{ enter: 300, leave: 300 }">
            <component :is="Component" class="content-view" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Footer -->
    <KioskFooter />
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import KioskAppBar from '@/kiosk/components/layout/KioskAppBar.vue';
import KioskFooter from '@/kiosk/components/layout/KioskFooter.vue';
import { useConfigStore } from '@/kiosk/stores/config';
import { useSliderStore } from '@/kiosk/stores/slider';
import { useServicesStore } from '@/kiosk/stores/services';
import { useOfflineSync } from '@/kiosk/composables/useOfflineSync';
import type { KioskMode } from '@/kiosk/types';

const router = useRouter();
const route = useRoute();

// Stores
const configStore = useConfigStore();
const sliderStore = useSliderStore();
const servicesStore = useServicesStore();

const { config } = storeToRefs(configStore);

// Offline sync
const { syncStore, startAutoSync } = useOfflineSync();

// Computed current mode based on route
const currentMode = computed<KioskMode>(() => {
  return route.name === 'services' ? 'services' : 'attract';
});

// Handle mode switching via navigation
const handleModeSwitch = (newMode: KioskMode) => {
  console.log(`[App] Mode switch requested: ${newMode}`);

  if (newMode === 'services') {
    router.push({ name: 'services' });
  } else if (newMode === 'attract') {
    router.push({ name: 'attract' });
  }
};

// Initialize all stores with offline sync
async function initializeStores() {
  try {
    console.log('[App] Initializing stores...');

    // Sync all stores in parallel with offline support
    await Promise.all([
      syncStore('config', '/api/kiosk/config').then(() => configStore.fetchConfig()),
      syncStore('slides', '/api/kiosk/slides').then(() => sliderStore.fetchSlides()),
      syncStore('services', '/api/kiosk/services').then(() => servicesStore.fetchServices()),
    ]);

    console.log('[App] All stores initialized successfully');
  } catch (error) {
    console.error('[App] Failed to initialize stores:', error);

    // Try direct fetch as fallback
    try {
      await Promise.all([
        configStore.fetchConfig().catch((err) => console.error('Config fetch failed:', err)),
        sliderStore.fetchSlides().catch((err) => console.error('Slides fetch failed:', err)),
        servicesStore.fetchServices().catch((err) => console.error('Services fetch failed:', err)),
      ]);
    } catch (fallbackError) {
      console.error('[App] Fallback fetch also failed:', fallbackError);
    }
  }
}

// Setup auto-sync (every 5 minutes)
function setupAutoSync() {
  startAutoSync(async () => {
    console.log('[App] Auto-sync triggered');
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
  padding-top: 8vh;
  padding-bottom: 7vh;
  height: 100vh;
  overflow: hidden;
}

.content-view {
  width: 100%;
  height: 85vh;
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
