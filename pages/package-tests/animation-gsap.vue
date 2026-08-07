<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/animation-gsap`;

useSeoMeta({
  title: "Resux GSAP Progressive Animation Demo",
  description: "SSR-first content with GSAP idle-trigger enhancement.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const cards = [
  "Render SSR skeleton first",
  "Load GSAP only on demand",
  "Animate existing HTML safely",
  "Dispose animation on navigation",
];
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">GSAP Animation Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This route keeps content visible in SSR output and applies motion during idle time.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="animation-gsap-demo"
      trigger="idle"
      demo="animation-gsap"
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
