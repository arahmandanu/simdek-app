import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RunningTextMessage, RunningTextResponse } from '../types';

export const useRunningTextStore = defineStore('runningText', () => {
  // State
  const messages = ref<RunningTextMessage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);
  const language = ref<'id' | 'makassar'>('id'); // Default to Indonesian

  // Getters
  const hasMessages = computed(() => messages.value.length > 0);
  const messageCount = computed(() => messages.value.length);

  const displayMessages = computed(() => {
    return messages.value.map((msg) =>
      language.value === 'makassar' ? msg.textMakassar : msg.text
    );
  });

  // Actions
  async function fetchMessages() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/kiosk/running-text');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RunningTextResponse = await response.json();
      messages.value = data.messages.sort((a, b) => a.order - b.order);
      lastFetch.value = Date.now();

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch running text';
      console.error('Error fetching running text:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setLanguage(lang: 'id' | 'makassar') {
    language.value = lang;
  }

  function toggleLanguage() {
    language.value = language.value === 'id' ? 'makassar' : 'id';
  }

  function reset() {
    messages.value = [];
    error.value = null;
    lastFetch.value = null;
    language.value = 'id';
  }

  return {
    // State
    messages,
    loading,
    error,
    lastFetch,
    language,

    // Getters
    hasMessages,
    messageCount,
    displayMessages,

    // Actions
    fetchMessages,
    setLanguage,
    toggleLanguage,
    reset,
  };
});
