<template>
  <section class="grid gap-6 lg:grid-cols-[18rem_1fr]">
    <aside class="panel h-fit p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Dashboard layout</p>
      <div class="mt-5 grid gap-2 text-sm text-slate-300">
        <ResuxLink to="/" class="rounded-2xl px-3 py-2 hover:bg-white/10">Overview</ResuxLink>
        <ResuxLink to="/async" class="rounded-2xl px-3 py-2 hover:bg-white/10">SSR data</ResuxLink>
        <ResuxLink to="/performance" class="rounded-2xl px-3 py-2 hover:bg-white/10">Benchmarks</ResuxLink>
      </div>
    </aside>
    <div class="min-w-0">
      <slot />
    </div>
  </section>
</template>
