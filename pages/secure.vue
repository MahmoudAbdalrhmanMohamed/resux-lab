<script setup lang="ts">
definePageMeta({ middleware: 'auth', title: 'Secure page' })
</script>
<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-emerald-200">Middleware passed</p>
    <h1 class="mt-4 text-4xl font-black text-white">Secure route</h1>
    <p class="mt-4 text-slate-300">Add <code>?token=resux</code> to pass the route middleware.</p>
  </section>
</template>
