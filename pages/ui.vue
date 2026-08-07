<script setup lang="ts">
definePageMeta({ title: 'UI API Showcase' })
</script>

<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Public API verification</p>
    <h1 class="mt-4 text-4xl font-black text-white">Resux UI showcase</h1>
    <p class="mt-4 max-w-3xl text-slate-300">
      The server renders this page shell first. The nested Vue island imports and exercises the public
      <code>resuxjs/ui</code> components, including the DatePicker that was previously undocumented.
    </p>

    <div class="mt-8" data-testid="ui-island-shell">
      <VueIsland name="UiShowcase" />
    </div>
  </section>
</template>
