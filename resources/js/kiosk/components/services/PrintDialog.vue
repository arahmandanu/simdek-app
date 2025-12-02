<template>
  <v-dialog v-model="internalShow" max-width="700" persistent>
    <v-card class="print-dialog">
      <v-card-title class="text-h4 pa-6">
        <v-icon icon="mdi-printer" size="large" color="primary" class="mr-3" />
        {{ service?.title }}
      </v-card-title>

      <v-card-text class="pa-6 text-h6">
        <div class="dialog-message">
          <p class="mb-4">
            Dokumen ini akan dicetak / <span class="text-makassar">Pammari' anne napparepe</span>
          </p>
          <p class="mb-0">Pastikan printer tersedia dan terhubung.</p>
        </div>

        <!-- Service details -->
        <v-divider class="my-4" />

        <div class="service-info">
          <div class="info-row">
            <strong>Layanan:</strong>
            <span>{{ service?.title }} / {{ service?.titleMakassar }}</span>
          </div>
        </div>

        <!-- Error message -->
        <v-alert v-if="printError" type="error" class="mt-4" variant="tonal">
          {{ printError }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          size="x-large"
          variant="text"
          :disabled="isPrinting"
          class="action-btn"
          @click="handleCancel"
        >
          Batal / <span class="text-makassar">Tassengka'</span>
        </v-btn>
        <v-btn
          color="primary"
          size="x-large"
          variant="elevated"
          :loading="isPrinting"
          :disabled="isPrinting"
          class="action-btn"
          @click="handlePrint"
        >
          <v-icon icon="mdi-printer" class="mr-2" />
          Cetak / <span class="text-makassar">Pammari'</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePrint } from '@/kiosk/composables/usePrint';
import type { ServiceItem } from '@/kiosk/types';

interface Props {
  show: boolean;
  service: ServiceItem | null;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'printed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const internalShow = ref(props.show);
const { isPrinting, printError, printDocument } = usePrint();

// Sync internal show with prop
watch(
  () => props.show,
  (newValue) => {
    internalShow.value = newValue;
  }
);

watch(internalShow, (newValue) => {
  if (!newValue) {
    emit('update:show', false);
  }
});

const handlePrint = async () => {
  if (!props.service) return;

  // For now, trigger browser print dialog
  // In production, this would print a specific document template
  await printDocument();

  // Wait a bit then close dialog
  setTimeout(() => {
    internalShow.value = false;
    emit('printed');
  }, 1000);
};

const handleCancel = () => {
  internalShow.value = false;
};
</script>

<style scoped>
.print-dialog {
  border-radius: 16px;
}

.dialog-message {
  line-height: 1.6;
}

.text-makassar {
  font-style: italic;
  color: #616161;
}

.service-info {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row strong {
  color: #424242;
  font-size: 1.1rem;
}

.info-row span {
  color: #616161;
  font-size: 1rem;
}

.action-btn {
  min-width: 180px;
  min-height: 80px;
  font-size: 1.25rem;
}

/* Ensure touch targets are large enough */
@media (max-width: 768px) {
  .action-btn {
    min-width: 150px;
    min-height: 70px;
    font-size: 1.1rem;
  }
}

/* Large displays (kiosk mode) */
@media (min-width: 1080px) {
  .action-btn {
    min-width: 200px;
    min-height: 90px;
    font-size: 1.35rem;
  }
}
</style>
