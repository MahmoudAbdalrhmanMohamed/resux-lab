<script setup lang="ts">
definePageMeta({ layout: 'dashboard', title: 'Performance bench' })
const clicks = useState('perf-clicks', () => 0)
const last = useState('perf-last', () => 'No browser measurement yet')
const average = useState('perf-average', () => 'Run API benchmark')
function measureClick() {
  const start = performance.now()
  clicks.value++
  const end = performance.now()
  last.value = (end - start).toFixed(3) + ' ms state patch'
}
async function runApiBench() {
  const start = performance.now()
  let total = 0
  for (let index = 0; index < 5; index++) {
    const response = await fetch('/api/stats?source=browser-bench&n=' + index)
    if (response.ok) total++
  }
  const end = performance.now()
  average.value = ((end - start) / 5).toFixed(2) + ' ms avg across ' + total + ' API calls'
}
</script>

<template>
  <section class="grid gap-6">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Performance</p>
      <h1 class="mt-4 text-4xl font-black text-white">Measure first interaction and API latency</h1>
      <p class="mt-4 max-w-2xl text-slate-300">This page gives simple real browser measurements. For repeatable server timings, use <code>npm run perf</code> after starting the app.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button class="btn-primary" @click="measureClick">Measure state patch</button>
        <button class="btn-secondary" @click="runApiBench">Run API benchmark</button>
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <MetricBadge label="Clicks" :value="String(clicks)" tone="resumable handler" />
      <MetricBadge label="Last patch" :value="last" tone="performance.now" />
      <MetricBadge label="API avg" :value="average" tone="5 browser requests" />
    </div>
  </section>
</template>
