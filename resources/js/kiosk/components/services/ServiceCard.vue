<template>
  <v-card class="service-card" elevation="2" @click="handleClick" v-ripple>
    <v-card-text class="service-card-content">
      <!-- Icon -->
      <div class="service-icon-wrapper">
        <v-icon :icon="service.icon" size="64" color="primary" />
      </div>

      <!-- Title -->
      <h3 class="service-title">{{ service.title }}</h3>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ServiceItem } from '@/kiosk/types';

interface Props {
  service: ServiceItem;
}

interface Emits {
  (e: 'select', service: ServiceItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('select', props.service);
};
</script>

<style scoped>
.service-card {
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 240px;
  border-radius: 16px;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.service-card:active {
  transform: translateY(-2px);
}

.service-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem !important;
  text-align: center;
  min-height: 240px;
}

.service-icon-wrapper {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  color: #212121;
}

/* Portrait mode optimizations */
@media (max-width: 768px) {
  .service-card {
    min-height: 220px;
  }

  .service-card-content {
    padding: 1.5rem 1rem !important;
    min-height: 220px;
  }

  .service-title {
    font-size: 1.3rem;
  }
}

/* Large portrait displays (kiosk mode) */
@media (min-width: 1080px) {
  .service-card {
    min-height: 260px;
  }

  .service-card-content {
    padding: 2.5rem 2rem !important;
    min-height: 260px;
  }

  .service-icon-wrapper {
    width: 96px;
    height: 96px;
  }

  .service-title {
    font-size: 1.75rem;
  }
}

/* Ensure minimum touch target size */
.service-card {
  min-width: 180px;
  min-height: 180px;
}
</style>
