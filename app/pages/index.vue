<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { definePageMeta, useSimpleHead } from '#imports';
import { Stage } from '~~/game/Stage';

definePageMeta({
  layout: false,
});

useSimpleHead({
  title: 'BackTrack',
  description: 'Unofficial Back Market themed web video game',
});

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (!canvas.value) return;

  new Stage(canvas.value);
});
</script>

<template>
  <canvas ref="canvas" class="fixed -z-10 inset-0 outline-0 select-none"></canvas>
</template>
