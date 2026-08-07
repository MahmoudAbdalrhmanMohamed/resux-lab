<script setup lang="ts">
definePageMeta({ title: 'Routes' })
const examples = [
  { href: '/routes/alpha', title: 'Dynamic route alpha' },
  { href: '/routes/42', title: 'Dynamic route 42' },
  { href: '/docs/resux/compiler/routes', title: 'Catch-all docs route' },
  { href: '/old-dashboard', title: 'Route rule redirect' }
]
</script>

<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">File-based routing</p>
    <h1 class="mt-4 text-4xl font-black text-white">Routing test matrix</h1>
    <div class="mt-8 grid gap-3 sm:grid-cols-2">
      <ResuxLink v-for="item in examples" :to="item.href" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
        {{ item.title }}
      </ResuxLink>
    </div>
  </section>
</template>
