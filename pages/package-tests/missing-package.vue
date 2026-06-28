<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/missing-package`;

useSeoMeta({
  title: "Resux Missing Package Diagnostics Demo",
  description: "SSR content remains visible while missing optional package errors are shown clearly on client.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Missing Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This route intentionally loads a missing package to validate user-friendly diagnostics without breaking SSR content.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="missing-package-demo"
      trigger="interaction"
      demo="missing-package"
    >
      <p class="text-xs text-slate-300">
        Enhancement status: <strong data-rx-package-status>idle</strong>
      </p>
      <p class="mt-3 text-sm text-slate-300">
        Click this panel to trigger the missing package load and view the friendly error message.
      </p>
    </ClientEnhance>
  </main>
</template>
