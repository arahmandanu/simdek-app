<template>
  <div class="services-view">
    <!-- Services Mode: Services Grid -->
    <ServicesGrid @select="handleServiceSelect" />

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
import PrintDialog from '@/kiosk/components/services/PrintDialog.vue';
import { useIdleTimeout } from '@/kiosk/composables/useIdleTimeout';
import type { ServiceItem } from '@/kiosk/types';

const router = useRouter();

// Print dialog state
const showPrintDialog = ref(false);
const selectedService = ref<ServiceItem | null>(null);

// Idle timeout - return to attract mode after 15 seconds of inactivity
const { showCountdown, countdownSeconds, resetTimer, stopTimer } = useIdleTimeout(() => {
  returnToAttractMode();
});

// Return to attract mode (idle timeout)
const returnToAttractMode = () => {
  console.log('[ServicesView] Idle timeout - Returning to attract mode');

  // Clean up state
  showPrintDialog.value = false;
  selectedService.value = null;

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
