<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/page-load`;

useSeoMeta({
  title: "Resux Page-Load Trigger Demo",
  description: "Page-load trigger enhancement test with SSR-first content.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Page-Load Trigger Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page validates <code>trigger=&quot;page-load&quot;</code>. SSR content renders first, then enhancement runs after full page load.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="page-load-demo"
      trigger="page-load"
      demo="page-load"
    >
      <p class="text-xs text-slate-300">
        Enhancement status: <strong data-rx-package-status>idle</strong>
      </p>
      <p class="mt-3 text-sm text-slate-300">
        Expected result: status should move from <strong>idle</strong> to <strong>ready</strong> after the window <code>load</code> event.
      </p>
    </ClientEnhance>
  </main>
</template>
