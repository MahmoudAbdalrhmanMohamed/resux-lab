<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/animation`;

useSeoMeta({
  title: "Resux Animation Enhancement Demo",
  description: "SSR-first animation integration where text remains visible without JavaScript.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const cards = [
  "Pipeline health",
  "Route rendering",
  "Async delivery",
  "Media quality",
];
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Animation Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      Content is SSR-first and readable before enhancement; animation packages should only decorate the UI.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="animation-demo"
      trigger="idle"
      demo="animation"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <ul class="mt-3 grid gap-3 md:grid-cols-2">
        <li
          v-for="item in cards"
          :key="item"
          class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200"
        >
          {{ item }}
        </li>
      </ul>
    </ClientEnhance>
  </main>
</template>
