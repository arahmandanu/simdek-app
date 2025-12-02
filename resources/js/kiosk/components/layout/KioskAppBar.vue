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
        <div class="logo-wrapper">
          <v-img
            :src="logoUrl"
            :alt="headerTitle"
            height="45"
            width="45"
            cover
            class="logo-image"
          />
        </div>
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
  logoUrl: '/logo.png',
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
  gap: 0.75rem;
}

.logo-wrapper {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-image {
  border-radius: 4px;
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
