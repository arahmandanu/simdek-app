import { ref } from 'vue';

export function useMediaLoader() {
  const isLoading = ref(true);
  const hasError = ref(false);

  const handleLoad = () => {
    isLoading.value = false;
  };

  const handleError = (errorMessage?: string) => {
    isLoading.value = false;
    hasError.value = true;
    if (errorMessage) {
      console.error(errorMessage);
    }
  };

  const reset = () => {
    isLoading.value = true;
    hasError.value = false;
  };

  return {
    isLoading,
    hasError,
    handleLoad,
    handleError,
    reset,
  };
}
