<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" class="d-flex align-center justify-center">
        <div class="text-center">
          <v-icon size="100" color="primary">mdi-information-outline</v-icon>
          <h1 class="text-h3 mt-4 mb-2">SIGMA Frontliner Kiosk</h1>
          <p class="text-h6 text-grey">Sistem Informasi Manajemen Desa</p>
          <p class="text-body-1 text-grey mt-4">Kiosk is ready. Content will be displayed here.</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Home view - Currently serves as a placeholder
// The actual kiosk interface is in App.vue with dual-mode layout
</script>

<style scoped>
.fill-height {
  min-height: 85vh;
}
</style>
