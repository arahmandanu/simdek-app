<template>
  <v-app-bar
    :color="props.mode === 'attract' ? 'primary' : 'white'"
    :elevation="2"
    fixed
    height="8vh"
    class="kiosk-app-bar"
  >
    <v-container fluid class="d-flex align-center justify-space-between">
        <!-- Logo Section -->
        <div class="logo-wrapper flex-shrink-0">
            <v-img
            :src="logoUrl"
            :alt="headerTitle"
            cover
            class="logo-image"
            />
        </div>

        <div class="header-title flex-grow-1 text-center">
            <h1 class="text-h4 font-weight-bold custom-font-bar" :class="titleColor">
                SIGMA
            </h1>

            <h1 class="text-h4 custom-font-bar-bottom" :class="titleColor">
                SYSTEM INFORMASI DIGITAL GOWA MAJU
            </h1>
        </div>
        <!-- <div class="logo-section d-flex align-center">
            <div class="logo-wrapper flex-shrink-0">
            <v-img
                :src="logoUrl"
                :alt="headerTitle"
                cover
                class="logo-image"
            />
            </div>
            <div class="header-title ms-4">
            <h1 class="text-h4 font-weight-bold custom-font-bar" :class="titleColor">
                SIGMA
            </h1>

            <h1 class="text-h4 custom-font-bar-bottom" :class="titleColor">
                SYSTEM INFORMASI DIGITAL GOWA MAJU
            </h1>
            </div>
        </div> -->

      <!-- Action Button -->
       <div class="header-button flex-shrink-0">
            <v-btn
            :color="buttonColor"
            size="x-large"
            elevation="2"
            min-width="180"
            min-height="50"
            class="text-h6 font-weight-bold"
            @click="handleModeSwitch"
            >
            {{ buttonText }}
        </v-btn>
       </div>

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
  return props.mode === 'attract' ? 'MENU' : 'KEMBALI';
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
  height: 8vh !important;
  max-height: 8vh !important;
}

.kiosk-app-bar :deep(.v-toolbar__content) {
  height: 8vh !important;
  padding: 0 !important;
}

.logo-section {
  flex-shrink: 0;
  gap: 0.75rem;
}

.logo-wrapper {
  width: 140px !important;
  height: 140px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-wrapper :deep(.v-img) {
  width: 140px !important;
  height: 140px !important;
}

.logo-image {
  border-radius: 4px;
}

.header-title h1 {
  line-height: 1.2 !important;
  white-space: nowrap;
}

/* Ensure minimum touch target size */
.v-btn {
  min-width: 180px !important;
  min-height: 50px !important;
  border-radius: 8px !important;
  font-size: 1.1rem !important;
}

.header-button{
    width: auto;
    height: auto;
}
/* Responsive adjustments for portrait mode */
@media (max-width: 1080px) {
    .custom-font-bar {
        font-size: 3vh !important;
        letter-spacing: -1px !important;
    }

    .custom-font-bar-bottom {
        font-size: 1.9vh !important;
        letter-spacing: -1px !important;
    }

    .v-btn {
        min-width: 160px !important;
        min-height: 48px !important;
        font-size: 1.5rem !important;
    }
}
</style>
