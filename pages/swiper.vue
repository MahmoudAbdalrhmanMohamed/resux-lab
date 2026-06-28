<script setup lang="ts">
useSeoMeta({
  title: "Resux Swiper Route Moved",
  description: "The Swiper package demo moved to /package-tests/swiper with SSR-first progressive enhancement.",
});
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Swiper Demo Moved</h1>
    <p class="mt-3 text-sm text-slate-300">
      The old Swiper bench route was replaced by the package compatibility suite.
    </p>
    <ResuxLink to="/package-tests/swiper" class="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
      Open /package-tests/swiper
    </ResuxLink>
  </main>
</template>
