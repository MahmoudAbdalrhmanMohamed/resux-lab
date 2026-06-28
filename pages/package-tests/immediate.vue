<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/immediate`;

useSeoMeta({
  title: "Resux Immediate Trigger Demo",
  description: "Immediate trigger enhancement test with SSR-first content.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Immediate Trigger Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page validates <code>data-trigger="immediate"</code>. SSR content renders first, then enhancement runs right after scan.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="immediate-demo"
      trigger="immediate"
      demo="immediate"
    >
      <p class="text-xs text-slate-300">
        Enhancement status: <strong data-rx-package-status>idle</strong>
      </p>
      <p class="mt-3 text-sm text-slate-300">
        Expected result: status should move from <strong>idle</strong> to <strong>ready</strong> without user interaction.
      </p>
    </ClientEnhance>
  </main>
</template>
