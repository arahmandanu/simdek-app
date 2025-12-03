<template>
  <div class="layanan-prioritas-container">
    <v-container fluid class="prioritas-grid">
      <!-- Header -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <div class="header-section">
            <div class="number-badge">7</div>
            <h2 class="header-title">LAYANAN PRIORITAS</h2>
            <p class="header-subtitle">Kementerian ATR/BPN</p>
          </div>
        </v-col>
      </v-row>

      <!-- Services List -->
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="services-list">
            <div
              v-for="(service, index) in prioritasServices"
              :key="service.id"
              class="service-item"
              @click="handleServiceClick(service)"
              v-ripple
            >
              <div class="service-content">
                <div class="service-number">
                  {{ index + 1 }}
                </div>
                <div class="service-title">
                  {{ service.title }}
                </div>
                <div class="service-duration">
                  <div class="duration-badge">
                    <span class="duration-number">{{ service.duration }}</span>
                    <span class="duration-unit">{{ service.durationUnit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Footer -->
      <v-row justify="center" class="mt-3">
        <v-col cols="12" class="text-center">
          <p class="footer-text">Menuju Pelayanan Terpercaya</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface PrioritasService {
  id: number;
  title: string;
  duration: number;
  durationUnit: string;
  action?: string;
}

interface Emits {
  (e: 'select', service: PrioritasService): void;
}

const emit = defineEmits<Emits>();

// Services data based on the image
const prioritasServices = ref<PrioritasService[]>([
  {
    id: 1,
    title: 'Pengecekan Sertifikat',
    duration: 1,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 2,
    title: 'Surat Keterangan Pendaftaran Tanah',
    duration: 1,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 3,
    title: 'ROYA',
    duration: 5,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 4,
    title: 'Hak Tanggungan',
    duration: 7,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 5,
    title: 'Peralihan Hak',
    duration: 5,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 6,
    title: 'Pendaftaran SK',
    duration: 7,
    durationUnit: 'Hari',
    action: 'print',
  },
  {
    id: 7,
    title: 'Perubahan Hak',
    duration: 7,
    durationUnit: 'Hari',
    action: 'print',
  },
]);

const handleServiceClick = (service: PrioritasService) => {
  console.log('[LayananPrioritasGrid] Service clicked:', service.title);
  emit('select', service);
};
</script>

<style scoped>
.layanan-prioritas-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  position: relative;
}

.layanan-prioritas-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(194, 40, 42, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(194, 40, 42, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.prioritas-grid {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header Section */
.header-section {
  margin-bottom: 1.25rem;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.number-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #c2282a 0%, #8b1d1f 100%);
  color: white;
  font-size: 2.5rem;
  font-weight: 900;
  border-radius: 16px;
  margin-bottom: 0.5rem;
  box-shadow: 0 6px 16px rgba(194, 40, 42, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  display: inline-block;
  background: linear-gradient(135deg, #c2282a 0%, #d63031 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(194, 40, 42, 0.3);
  letter-spacing: 0.5px;
}

/* Services List */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  flex: 1;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-item {
  background: white;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.service-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 5px;
  background: linear-gradient(135deg, #c2282a 0%, #d63031 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.service-item:hover::before {
  transform: scaleY(1);
}

.service-item:hover {
  transform: translateX(8px) translateY(-4px);
  box-shadow: 0 8px 24px rgba(194, 40, 42, 0.15);
  border-color: rgba(194, 40, 42, 0.2);
}

.service-item:active {
  transform: translateX(4px) translateY(-2px);
}

.service-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.service-number {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #c2282a 0%, #d63031 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  box-shadow: 0 3px 8px rgba(194, 40, 42, 0.3);
  transition: all 0.3s ease;
}

.service-item:hover .service-number {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 6px 16px rgba(194, 40, 42, 0.4);
}

.service-title {
  flex: 1;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
}

.service-item:hover .service-title {
  color: #c2282a;
}

.service-duration {
  flex-shrink: 0;
}

.duration-badge {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  box-shadow: 0 3px 8px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
}

.service-item:hover .duration-badge {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
}

.duration-number {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
}

.duration-unit {
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-top: 0.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Footer */
.footer-text {
  font-size: 1rem;
  color: #666;
  font-style: italic;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }

  .service-content {
    gap: 1rem;
  }

  .service-number {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .service-title {
    font-size: 1.2rem;
  }

  .duration-number {
    font-size: 1.2rem;
  }
}

@media (min-width: 1080px) {
  .number-badge {
    width: 100px;
    height: 100px;
    font-size: 4rem;
  }

  .header-title {
    font-size: 3rem;
  }

  .service-item {
    padding: 2rem 2.5rem;
  }

  .service-number {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }

  .service-title {
    font-size: 2rem;
  }
}

/* Custom scrollbar */
.layanan-prioritas-container::-webkit-scrollbar {
  width: 12px;
}

.layanan-prioritas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.layanan-prioritas-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.layanan-prioritas-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Disable text selection */
.layanan-prioritas-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
