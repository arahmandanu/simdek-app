<template>
  <v-app-bar
    :color="props.mode === 'attract' ? 'primary' : 'white'"
    :elevation="2"
    fixed
    height="5vh"
    class="kiosk-app-bar"
  >
    <v-container fluid class="d-flex align-center justify-space-between pa-0 px-6">
      <!-- Logo Section -->
      <div class="logo-section d-flex align-center">
        <v-img
          :src="logoUrl"
          :alt="headerTitle"
          max-height="40"
          max-width="40"
          contain
          class="mr-3"
        />
        <div class="header-title">
          <h1 class="text-subtitle-1 font-weight-bold" :class="titleColor">
            {{ headerTitle }}
          </h1>
        </div>
      </div>

      <!-- Action Button -->
      <v-btn
        :color="buttonColor"
        size="large"
        elevation="2"
        min-width="150"
        min-height="40"
        class="text-body-1 font-weight-bold"
        @click="handleModeSwitch"
      >
        {{ buttonText }}
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KioskMode } from '@/kiosk/types';

interface Props {
  mode?: KioskMode;
  logoUrl?: string;
  headerTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'attract',
  logoUrl: '/images/logo-gowa.png',
  headerTitle: 'SIGMA Frontliner Kiosk',
});

interface Emits {
  (e: 'switchMode', mode: KioskMode): void;
}

const emit = defineEmits<Emits>();

const buttonText = computed(() => {
  return props.mode === 'attract' ? 'MENU LAYANAN' : 'KEMBALI';
});

const buttonColor = computed(() => {
  return props.mode === 'attract' ? 'white' : 'primary';
});

const titleColor = computed(() => {
  return props.mode === 'attract' ? 'text-white' : 'text-primary';
});

const handleModeSwitch = () => {
  const newMode: KioskMode = props.mode === 'attract' ? 'services' : 'attract';
  emit('switchMode', newMode);
};
</script>

<style scoped>
.kiosk-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 5vh !important;
  max-height: 5vh !important;
}

.kiosk-app-bar :deep(.v-toolbar__content) {
  height: 5vh !important;
  padding: 0 !important;
}

.logo-section {
  flex-shrink: 0;
}

.header-title h1 {
  line-height: 1.2;
  white-space: nowrap;
}

/* Ensure minimum touch target size */
.v-btn {
  min-width: 150px;
  min-height: 40px;
  border-radius: 6px;
}

/* Responsive adjustments for portrait mode */
@media (max-width: 1080px) {
  .header-title h1 {
    font-size: 1rem !important;
  }

  .v-btn {
    min-width: 130px;
    min-height: 40px;
    font-size: 0.95rem !important;
  }
}
</style>
