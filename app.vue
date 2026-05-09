<template>
  <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32rem),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30rem)]">
    <header class="shell py-6">
      <nav class="panel flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <ResuxLink to="/" class="flex items-center gap-3 font-bold text-white">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">R</span>
          <span>Resux Lab Bench</span>
        </ResuxLink>
        <div class="flex flex-wrap gap-2 text-sm">
          <ResuxLink to="/state" class="badge hover:bg-white/20">State</ResuxLink>
          <ResuxLink to="/forms" class="badge hover:bg-white/20">Forms</ResuxLink>
          <ResuxLink to="/async" class="badge hover:bg-white/20">Async</ResuxLink>
          <ResuxLink to="/routes" class="badge hover:bg-white/20">Routes</ResuxLink>
          <ResuxLink to="/media" class="badge hover:bg-white/20">Media</ResuxLink>
          <ResuxLink to="/performance" class="badge hover:bg-white/20">Performance</ResuxLink>
        </div>
      </nav>
    </header>
    <ResuxLoadingIndicator color="#22d3ee" error-color="#f97316" height="4" duration="1700" throttle="0">
      <p class="px-5 pt-2 pb-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Navigating</p>
    </ResuxLoadingIndicator>
    <main class="shell pb-16">
      <ResuxPage />
    </main>
  </div>
</template>
