<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/echarts`;

useSeoMeta({
  title: "Resux ECharts Progressive Demo",
  description: "SSR-first ECharts integration with semantic fallback content before client enhancement.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const stats = [
  { label: "North", value: 44 },
  { label: "South", value: 32 },
  { label: "East", value: 58 },
  { label: "West", value: 27 },
];
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">ECharts Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      Sales summary is rendered in SSR HTML first. ECharts enhances it to an interactive chart when visible.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="echarts-demo"
      trigger="visible"
      demo="echarts"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <ul class="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-4">
        <li
          v-for="row in stats"
          :key="row.label"
          class="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2"
          data-rx-echarts-row
          :data-rx-echarts-label="row.label"
          :data-rx-echarts-value="row.value"
        >
          <strong>{{ row.label }}</strong>: {{ row.value }}
        </li>
      </ul>
      <div class="mt-4 h-72 rounded-lg border border-slate-700 bg-slate-900/60 p-2">
        <div data-rx-echarts-root class="h-full w-full"></div>
      </div>
    </ClientEnhance>
  </main>
</template>
