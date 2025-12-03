<template>
  <div>
    <v-fade-transition>
      <div v-if="isLoading" class="loading-overlay">
        <v-progress-circular indeterminate size="64" color="white" />
      </div>
    </v-fade-transition>

    <v-fade-transition>
      <div v-if="hasError" class="error-overlay">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
        <p class="text-h6 mt-4">{{ errorMessage }}</p>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

withDefaults(defineProps<Props>(), {
  errorMessage: 'Konten tidak dapat dimuat',
});
</script>

<style scoped>
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  z-index: 5;
}
</style>
