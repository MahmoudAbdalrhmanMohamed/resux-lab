<script setup lang="ts">
const route = useRoute()
definePageMeta({ title: 'Dynamic route' })
function goHome() { useRouter().push('/') }
</script>

<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Dynamic param</p>
    <h1 class="mt-4 text-4xl font-black text-white">Route id: {{ route.params.id }}</h1>
    <p class="mt-4 text-slate-300">Current path: {{ route.path }}</p>
    <button class="btn-primary mt-8" @click="goHome">Navigate home</button>
  </section>
</template>
