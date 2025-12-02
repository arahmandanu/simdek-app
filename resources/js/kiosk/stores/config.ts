import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KioskConfig } from '../types';

export const useConfigStore = defineStore('config', () => {
  // State
  const config = ref<KioskConfig>({
    theme: {
      primaryColor: '#c2282a',
      logo: '',
      headerTitle: 'SIMDES Kiosk',
    },
    idleTimeout: {
      enabled: true,
      duration: 60000, // 60 seconds
    },
  });

  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);

  // Actions
  async function fetchConfig() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/kiosk/config');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      config.value = data;
      lastFetch.value = Date.now();

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch config';
      console.error('Error fetching kiosk config:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    config.value = {
      theme: {
        primaryColor: '#c2282a',
        logo: '',
        headerTitle: 'SIMDES Kiosk',
      },
      idleTimeout: {
        enabled: true,
        duration: 60000,
      },
    };
    error.value = null;
    lastFetch.value = null;
  }

  return {
    // State
    config,
    loading,
    error,
    lastFetch,

    // Actions
    fetchConfig,
    reset,
  };
});
