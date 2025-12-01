<script setup lang="ts">
import { ref } from 'vue';

const menuItems = ref([
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Cetak Surat', path: '/cetak-surat', icon: 'mdi-printer' },
]);
</script>

<template>
  <v-app-bar color="primary" elevation="4" height="80">
    <v-container fluid class="d-flex align-center px-6">
      <!-- Logo -->
      <div class="d-flex align-center">
        <v-avatar size="60" color="white" class="mr-4">
          <v-icon size="40" color="primary">mdi-shield-crown</v-icon>
        </v-avatar>
        <div class="text-white">
          <div class="text-h6 font-weight-bold">Pemerintah Daerah</div>
          <div class="text-caption">Sistem Informasi Terpadu</div>
        </div>
      </div>

      <v-spacer />

      <!-- Menu Items -->
      <v-btn
        v-for="item in menuItems"
        :key="item.path"
        :prepend-icon="item.icon"
        variant="text"
        color="white"
        size="large"
        class="mx-2"
      >
        {{ item.title }}
      </v-btn>
    </v-container>
  </v-app-bar>
</template>
