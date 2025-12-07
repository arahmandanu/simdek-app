<template>
  <v-footer color="primary" app fixed height="7vh" class="kiosk-footer">
    <v-container fluid class="pa-0">
      <div class="marquee-container">
        <div class="marquee-content" :style="marqueeStyle">
          <span
            v-for="(message, index) in duplicatedMessages"
            :key="`msg-${index}`"
            class="marquee-item"
          >
            {{ message }}
          </span>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRunningTextStore } from '../../stores/runningText';
import { useOfflineSync } from '../../composables/useOfflineSync';

interface Props {
  speed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 30,
});

// Stores
const runningTextStore = useRunningTextStore();
const { displayMessages } = storeToRefs(runningTextStore);

// Offline sync
const { syncStore } = useOfflineSync();

// Duplicate messages for seamless loop
const duplicatedMessages = computed(() => {
  const messages = displayMessages.value;
  if (messages.length === 0) {
    return [];
  }
  // Duplicate the array to create seamless loop
  return [...messages, ...messages];
});

const marqueeStyle = computed(() => ({
  animationDuration: `${props.speed}s`,
}));

// Fetch running text on mount
onMounted(async () => {
  try {
    // Try to sync with offline support
    const data = await syncStore('runningText', '/api/kiosk/running-text');
    if (data) {
      // Store will be updated by the API call in fetchMessages
      await runningTextStore.fetchMessages();
    }
  } catch (err) {
    console.error('Failed to load running text:', err);
    // If offline sync fails, try direct fetch
    try {
      await runningTextStore.fetchMessages();
    } catch (fetchErr) {
      console.error('Direct fetch also failed:', fetchErr);
    }
  }
});
</script>

<style scoped>
.kiosk-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  overflow: hidden;
  min-height: 7vh;
}

.marquee-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: rgb(var(--v-theme-primary));
}

.marquee-content {
  display: flex;
  white-space: nowrap;
  animation: marquee linear infinite;
  will-change: transform;
}

.marquee-item {
  display: inline-block;
  padding: 0 4rem;
  color: white;
  font-size: 2vh !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause animation on hover for accessibility */
.marquee-content:hover {
  animation-play-state: paused;
}

/* Responsive font size */
@media (max-width: 1080px) {
  .marquee-item {
    font-size: 2rem;
    padding: 0 3rem;
  }
}

@media (max-width: 768px) {
  .marquee-item {
    font-size: 1.1rem;
    padding: 0 2rem;
  }
}
</style>
