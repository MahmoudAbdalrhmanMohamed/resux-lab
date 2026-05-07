<script setup lang="ts">
definePageMeta({ title: 'State and resumable handlers' })
const count = useState('lab-count', () => 0)
const step = useState('lab-step', () => 1)
const message = useState('lab-message', () => 'First click loads this page handler chunk.')
function increment() { count.value = count.value + step.value; message.value = 'Incremented with resumable @click.' }
function decrement() { count.value = count.value - step.value; message.value = 'Decremented with resumable @click.' }
function reset() { count.value = 0; step.value = 1; message.value = 'State reset.' }
function biggerStep() { step.value = step.value + 1; message.value = 'Step changed without page hydration.' }
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1fr_22rem]">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Resumable state</p>
      <h1 class="mt-4 text-4xl font-black text-white">Counter: {{ count }}</h1>
      <p class="mt-3 text-slate-300">Step: {{ step }}. {{ message }}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button class="btn-primary" @click="increment">Increment</button>
        <button class="btn-secondary" @click="decrement">Decrement</button>
        <button class="btn-secondary" @click="biggerStep">Bigger step</button>
        <button class="btn-secondary" @click="reset">Reset</button>
      </div>
    </div>
    <TestCard title="What to inspect" label="Manual QA" status="interactive">
      <p class="mt-4 text-sm leading-7 text-slate-300">Open DevTools Network. On first interaction, Resux should load the handler chunk lazily, then patch only marked bindings.</p>
    </TestCard>
  </section>
</template>
