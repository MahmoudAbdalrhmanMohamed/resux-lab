<script setup lang="ts">
definePageMeta({ title: 'Vue Island' })
</script>
<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-purple-200">Vue runtime island</p>
    <h1 class="mt-4 text-4xl font-black text-white">Escape hatch test</h1>
    <p class="mt-4 text-slate-300">This island uses Vue runtime only for the nested widget.</p>
    <div class="mt-8">
      <VueIsland name="IslandCounter" :props="{ start: 7 }" />
    </div>
  </section>
</template>
