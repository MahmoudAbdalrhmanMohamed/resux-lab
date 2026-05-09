<script setup>
definePageMeta({ layout: 'dashboard', title: 'Resux Lab Bench' })
useSeoMeta({
  title: 'Resux Lab Bench',
  description: 'Full Resux test project for functionality and performance checks.',
  ogTitle: 'Resux Lab Bench',
  twitterCard: 'summary_large_image'
})
const features = [
  { title: 'Resumable handlers', href: '/state', label: 'Runtime', status: 'ready' },
  { title: 'v-model forms', href: '/forms', label: 'Compiler', status: 'ready' },
  { title: 'SSR async data', href: '/async', label: 'Data', status: 'ready' },
  { title: 'Dynamic routes', href: '/routes/alpha', label: 'Routing', status: 'ready' },
  { title: 'Catch-all docs', href: '/docs/resux/runtime/resume', label: 'Routing', status: 'ready' },
  { title: 'Image pipeline + loader', href: '/media', label: 'Media', status: 'new' },
  { title: 'Performance tests', href: '/performance', label: 'Bench', status: 'ready' }
]
</script>

<template>
  <section class="grid gap-8 w-full">
    <div class="panel p-8 sm:p-10">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Full framework test app</p>
      <h1 class="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">A polished Resux playground for testing functionality and performance.</h1>
      <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Use this app to validate routing, server rendering, resumable event handlers, server APIs, middleware, layouts, route rules, Vue islands, and Tailwind styling in one project.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <ResuxLink to="/performance" class="btn-primary">Open performance bench</ResuxLink>
        <ResuxLink to="/state" class="btn-secondary">Test interactions</ResuxLink>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full">
      <ResuxLink v-for="feature in features" :to="feature.href" class="panel block p-5 hover:bg-white/[0.09]">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{{ feature.label }}</p>
        <h2 class="mt-3 text-xl font-bold text-white">{{ feature.title }}</h2>
        <p class="mt-3 text-sm text-slate-400">Status: {{ feature.status }}</p>
      </ResuxLink>
    </div>
  </section>
</template>
