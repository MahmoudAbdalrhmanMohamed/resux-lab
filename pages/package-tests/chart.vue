<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/chart`;

useSeoMeta({
  title: "Resux Chart Progressive Demo",
  description: "SSR-first chart integration with fallback data table and client enhancement.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const rows = [
  { metric: "LCP", value: 1.8, trend: "improving" },
  { metric: "CLS", value: 1.1, trend: "stable" },
  { metric: "INP", value: 1.4, trend: "improving" },
];
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Chart Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      The table below is fully SSR and crawlable. A chart package can enhance this block on the client.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="chart-demo"
      trigger="visible"
      demo="chart"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <table class="mt-3 w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-slate-700 text-slate-300">
            <th class="py-2">Metric</th>
            <th class="py-2">Value</th>
            <th class="py-2">Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.metric"
            class="border-b border-slate-800"
            data-rx-chart-row
            :data-rx-chart-label="row.metric"
            :data-rx-chart-value="row.value"
          >
            <td class="py-2">{{ row.metric }}</td>
            <td class="py-2">{{ row.value }}</td>
            <td class="py-2">{{ row.trend }}</td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4 h-72 rounded-lg border border-slate-700 bg-slate-900/60 p-2">
        <canvas data-rx-chart-canvas class="h-full w-full"></canvas>
      </div>
    </ClientEnhance>
  </main>
</template>
