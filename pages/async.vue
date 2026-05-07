<script setup lang="ts">
definePageMeta({ title: 'Async data' })
type Stats = { app: string; timestamp: string; random: number; query: Record<string, string | string[]> }
const serverStats = await useAsyncData<Stats>('server-stats', ({ signal }) => $fetch('/api/stats?source=ssr', { signal }))
const lazyStats = useAsyncData<Stats>('lazy-stats', ({ signal }) => $fetch('/api/stats?source=client-skeleton', { signal }))
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-2">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Awaited SSR data</p>
      <h1 class="mt-4 text-3xl font-black text-white">Server resolved before HTML</h1>
      <p v-if="serverStats.error" class="mt-4 text-red-300">{{ serverStats.error.message }}</p>
      <pre v-if="serverStats.data" class="mt-6 overflow-auto rounded-3xl bg-slate-950 p-5 text-sm text-cyan-100">{{ serverStats.data }}</pre>
    </div>
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-purple-200">Skeleton async data</p>
      <h2 class="mt-4 text-3xl font-black text-white">Client can finish pending data</h2>
      <div v-if="lazyStats.pending" class="mt-6 h-32 animate-pulse rounded-3xl bg-white/10"></div>
      <p v-if="lazyStats.error" class="mt-4 text-red-300">{{ lazyStats.error.message }}</p>
      <pre v-if="!lazyStats.pending && !lazyStats.error && lazyStats.data" class="mt-6 overflow-auto rounded-3xl bg-slate-950 p-5 text-sm text-purple-100">{{ lazyStats.data }}</pre>
    </div>
  </section>
</template>
