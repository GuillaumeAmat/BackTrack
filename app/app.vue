<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
</script>

<template>
  <NuxtRouteAnnouncer />

  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <SpeedInsights />
    </NuxtLayout>
  </UApp>
</template>
