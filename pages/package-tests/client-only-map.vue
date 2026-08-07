<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/client-only-map`;

useSeoMeta({
  title: "Resux Client-Only Map Widget Demo",
  description: "Client-only widget pattern with SSR textual fallback and no hydration.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Client-Only Map Widget Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page demonstrates a browser-only widget pattern where SSR still provides readable fallback content.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="client-only-map-demo"
      trigger="visible"
      demo="client-only-map"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <p class="mt-3 text-sm text-slate-300">
        SSR fallback: map interactions require browser APIs, but this descriptive content is visible to users and crawlers.
      </p>
      <div
        data-rx-map-shell
        class="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-200"
      >
        Loading interactive map widget after client enhancement.
      </div>
    </ClientEnhance>
  </main>
</template>
