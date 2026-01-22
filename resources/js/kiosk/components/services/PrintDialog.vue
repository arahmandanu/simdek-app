<template>
  <v-dialog v-model="internalShow" max-width="700" persistent>
    <v-card class="print-dialog">
      <v-card-title class="text-h4 pa-6">
        <v-icon icon="mdi-printer" size="large" color="primary" class="mr-3" />
        {{ service?.title }}
      </v-card-title>

      <v-card-text class="pa-6 text-h6">
        <div class="dialog-message">
          <p class="mb-4">Dokumen ini akan dicetak</p>
          <p class="mb-0">Pastikan printer tersedia dan terhubung.</p>
        </div>

        <!-- Service details -->
        <v-divider class="my-4" />

        <div class="service-info">
          <div class="info-row">
            <strong>Layanan:</strong>
            <span>{{ service?.title }}</span>
          </div>
        </div>

        <!-- User data form -->
        <v-divider class="my-4" />

        <v-form validate-on="blur">
          <div class="form-section">
            <div class="form-header mb-4">
              <v-icon icon="mdi-account-circle" size="large" color="primary" class="mr-2" />
              <span class="form-title">Data Pencetak</span>
            </div>

            <v-text-field
              v-model="nama"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :rules="namaRules"
              class="form-input"
              density="comfortable"
              hide-details="auto"
            />

            <v-text-field
              v-model="ktpFormatted"
              label="Nomor KTP"
              placeholder="XX-XXXX-XXXXXX-XXXX"
              variant="outlined"
              prepend-inner-icon="mdi-card-account-details"
              type="tel"
              inputmode="numeric"
              maxlength="19"
              :rules="ktpRules"
              class="form-input mt-4"
              density="comfortable"
              hide-details="auto"
              @keypress="preventNonNumeric"
              @paste="handlePaste"
              @input="handleKtpInput"
            />
          </div>
        </v-form>

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
          Batal
        </v-btn>
        <v-btn
          color="primary"
          size="x-large"
          variant="elevated"
          :loading="isPrinting"
          :disabled="isPrinting || !isFormValid"
          class="action-btn"
          @click="handlePrint"
        >
          <v-icon icon="mdi-printer" class="mr-2" />
          Cetak
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePrint, type UserPrintData } from '@/kiosk/composables/usePrint';
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

// Form state
const nama = ref('');
const ktpRaw = ref('');

// Computed validation - enables button immediately when data is valid
const isFormValid = computed(() => {
  // Validate nama: between 2-100 characters, trimmed
  const namaValue = nama.value.trim();
  const isNamaValid = namaValue.length >= 2 && namaValue.length <= 100;

  // Validate KTP: exactly 16 digits
  const isKtpValid = ktpRaw.value.length === 16;

  // Both must be valid
  return isNamaValid && isKtpValid;
});

// Validation rules
const namaRules = [
  (v: string) => !!v || 'Nama lengkap wajib diisi',
  (v: string) => (v && v.length >= 2) || 'Nama minimal 2 karakter',
  (v: string) => (v && v.length <= 100) || 'Nama maksimal 100 karakter',
];

const ktpRules = [
  (v: string) => !!v || 'Nomor KTP wajib diisi',
  (v: string) => {
    const digitsOnly = v.replace(/\D/g, '');
    return digitsOnly.length === 16 || 'Nomor KTP harus 16 digit';
  },
];

// Computed formatted KTP for display
const ktpFormatted = computed({
  get: () => {
    const digits = ktpRaw.value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 12)
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 12)}-${digits.slice(12, 16)}`;
  },
  set: (value: string) => {
    // Strip all non-digits and limit to 16
    const digits = value.replace(/\D/g, '').slice(0, 16);
    ktpRaw.value = digits;
  },
});

// Prevent non-numeric characters from being typed
const preventNonNumeric = (event: KeyboardEvent) => {
  // Allow only digits 0-9
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};

// Handle paste events - extract only digits
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData('text') || '';
  const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 16);

  // Update raw value which will trigger formatting via computed
  ktpRaw.value = digitsOnly;
};

const handleKtpInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  const oldValue = ktpFormatted.value;
  const oldLength = oldValue.length;

  // Update the value
  ktpFormatted.value = input.value;

  // Restore cursor position (account for added dashes)
  const newValue = ktpFormatted.value;
  const newLength = newValue.length;
  const diff = newLength - oldLength;

  // Set cursor position in next tick
  setTimeout(() => {
    let newCursorPos = cursorPosition + diff;
    // Don't place cursor on dash
    if (newValue[newCursorPos - 1] === '-') {
      newCursorPos++;
    }
    input.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);
};

// Sync internal show with prop
watch(
  () => props.show,
  (newValue) => {
    internalShow.value = newValue;
  },
  { immediate: true }
);

watch(internalShow, (newValue) => {
  if (!newValue) {
    emit('update:show', false);
    // Reset form when dialog closes
    nama.value = '';
    ktpRaw.value = '';
    // isFormValid is computed, no need to reset manually
  }
});

const handlePrint = async () => {
  if (!props.service || !isFormValid.value) return;

  // Prepare user data
  const userData: UserPrintData = {
    nama: nama.value,
    ktp: ktpRaw.value,
  };

  // For now, trigger browser print dialog with user data
  // In production, this would print a specific document template
  await printDocument(undefined, userData);

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

.form-section {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
}

.form-header {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #424242;
}

.form-title {
  font-size: 1.2rem;
}

.form-input :deep(.v-field) {
  min-height: 64px;
  font-size: 1.1rem;
}

.form-input :deep(.v-field__input) {
  padding: 8px 0;
  min-height: 48px;
}

.form-input :deep(.v-label) {
  font-size: 1.1rem;
}

/* Fix prepend-inner-icon spacing */
.form-input :deep(.v-field__prepend-inner) {
  padding-inline-end: 12px;
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
