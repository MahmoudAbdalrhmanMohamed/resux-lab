<script setup lang="ts">
const route = useRoute()
definePageMeta({ title: 'Catch-all docs' })
</script>

<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Catch-all route</p>
    <h1 class="mt-4 text-4xl font-black text-white">Docs slug</h1>
    <p class="mt-4 text-slate-300">{{ route.params.slug }}</p>
    <ResuxLink to="/routes" class="btn-secondary mt-8">Back to routes</ResuxLink>
  </section>
</template>
