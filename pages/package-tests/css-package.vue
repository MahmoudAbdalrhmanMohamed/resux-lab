<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/css-package`;

useSeoMeta({
  title: "Resux CSS Package Demo",
  description: "SSR-first content with optional CSS package enhancement loaded only when needed.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">CSS Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page tests package-specific CSS behavior while preserving visible SSR content.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="css-package-demo"
      trigger="visible"
      demo="css-package"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <p class="mt-3 text-sm text-slate-300">
        Sample token style:
        <span data-rx-css-token class="rounded border border-slate-600 px-2 py-1 font-mono text-xs">"progressive-css-token"</span>
      </p>
      <pre class="mt-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200"><code>.demo-token {
  color: #22d3ee;
  border-color: rgba(34, 211, 238, 0.5);
}</code></pre>
    </ClientEnhance>
  </main>
</template>
