<script setup lang="ts">
const route = useRoute()
</script>
<template>
  <section class="mx-auto mt-10 max-w-2xl rounded-3xl border border-red-300/20 bg-red-500/10 p-8 text-white">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-red-200">Error</p>
    <h1 class="mt-4 text-4xl font-black">Resux handled this route error</h1>
    <p class="mt-4 text-red-100">Path: {{ route.path }}</p>
    <ResuxLink to="/" class="btn-secondary mt-8">Go home</ResuxLink>
  </section>
</template>
