<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/utility`;
const now = new Date().toISOString();

useSeoMeta({
  title: "Resux Utility Package Demo",
  description: "SSR-safe utility package integration pattern in Resux.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Utility Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      Utility packages that are SSR-safe should run on server and client without a client-only wrapper.
    </p>

    <section class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <h2 class="text-xl font-bold">Server-rendered output</h2>
      <p class="mt-2 text-sm text-slate-300">Current ISO timestamp rendered on server:</p>
      <code class="mt-2 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">{{ now }}</code>
    </section>
  </main>
</template>
