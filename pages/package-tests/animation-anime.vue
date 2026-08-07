<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/animation-anime`;

useSeoMeta({
  title: "Resux Anime.js Progressive Animation Demo",
  description: "SSR-first cards with anime.js enhancement executed on idle.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const cards = [
  "SSR content stays crawlable",
  "No hydration required",
  "Animation runs in browser only",
  "Cleanup remains route-safe",
];
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Anime.js Animation Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page demonstrates another progressive animation package style with the same Resux enhancement contract.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="animation-anime-demo"
      trigger="idle"
      demo="animation-anime"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <ul class="mt-3 grid gap-3 md:grid-cols-2">
        <li
          v-for="item in cards"
          :key="item"
          data-rx-animate-card
          class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200"
        >
          {{ item }}
        </li>
      </ul>
    </ClientEnhance>
  </main>
</template>
