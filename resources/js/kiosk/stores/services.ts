import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ServiceItem, ServicesResponse } from '../types';

export const useServicesStore = defineStore('services', () => {
  // State
  const services = ref<ServiceItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);

  // Getters
  const hasServices = computed(() => services.value.length > 0);
  const servicesCount = computed(() => services.value.length);

  // Actions
  async function fetchServices() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/kiosk/services');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServicesResponse = await response.json();
      services.value = data.services.sort((a, b) => a.order - b.order);
      lastFetch.value = Date.now();

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch services';
      console.error('Error fetching services:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function getServiceById(id: number): ServiceItem | undefined {
    return services.value.find((service) => service.id === id);
  }

  function getServicesByAction(action: string): ServiceItem[] {
    return services.value.filter((service) => service.action === action);
  }

  function reset() {
    services.value = [];
    error.value = null;
    lastFetch.value = null;
  }

  return {
    // State
    services,
    loading,
    error,
    lastFetch,

    // Getters
    hasServices,
    servicesCount,

    // Actions
    fetchServices,
    getServiceById,
    getServicesByAction,
    reset,
  };
});
