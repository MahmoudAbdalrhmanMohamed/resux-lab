<script setup lang="ts">
const props = defineProps<{ label: string; value: string; tone: string }>()
</script>

<template>
  <div class="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ props.label }}</p>
    <p class="mt-2 text-2xl font-black text-white">{{ props.value }}</p>
    <p class="mt-1 text-xs text-cyan-200">{{ props.tone }}</p>
  </div>
</template>
