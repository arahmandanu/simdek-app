<template>
  <div class="services-grid-container">
    <v-container fluid class="services-grid">
      <!-- Loading State -->
      <v-row v-if="servicesStore.loading" justify="center" align="center" class="loading-row">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary" />
          <p class="text-h5 mt-4">Memuat layanan...</p>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row
        v-else-if="!servicesStore.hasServices"
        justify="center"
        align="center"
        class="empty-row"
      >
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey-lighten-1">mdi-file-document-multiple</v-icon>
          <p class="text-h5 text-grey-lighten-1 mt-4">Tidak ada layanan tersedia</p>
        </v-col>
      </v-row>

      <!-- Services Grid -->
      <v-row v-else>
        <v-col v-for="service in servicesStore.services" :key="service.id" cols="12" sm="6" md="4">
          <ServiceCard :service="service" @select="handleServiceSelect" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useServicesStore } from '@/kiosk/stores/services';
import ServiceCard from './ServiceCard.vue';
import type { ServiceItem } from '@/kiosk/types';

interface Emits {
  (e: 'select', service: ServiceItem): void;
}

const emit = defineEmits<Emits>();

const servicesStore = useServicesStore();

const handleServiceSelect = (service: ServiceItem) => {
  emit('select', service);
};

onMounted(() => {
  // Fetch services if not already loaded
  if (!servicesStore.hasServices) {
    servicesStore.fetchServices();
  }
});
</script>

<style scoped>
.services-grid-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fafafa;
}

.services-grid {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-row,
.empty-row {
  min-height: 60vh;
}

/* Responsive padding for portrait mode */
@media (max-width: 768px) {
  .services-grid {
    padding: 1.5rem;
  }
}

@media (min-width: 1080px) {
  /* Portrait mode optimization */
  .services-grid {
    padding: 2.5rem;
  }
}

/* Custom scrollbar */
.services-grid-container::-webkit-scrollbar {
  width: 12px;
}

.services-grid-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.services-grid-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.services-grid-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
