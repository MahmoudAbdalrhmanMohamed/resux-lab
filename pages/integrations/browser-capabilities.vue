<script setup lang="ts">
definePageMeta({ title: 'Browser Capabilities' })
</script>

<template>
  <section class="panel p-8">
    <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Integration verification</p>
    <h1 class="mt-4 text-4xl font-black text-white">Camera, permissions, and file picker</h1>
    <p class="mt-4 max-w-3xl text-slate-300">
      This page verifies the browser-only integration pattern used by the documentation. Capability checks
      happen inside a Vue island, and sensitive permission requests run only after an explicit click.
    </p>

    <div class="mt-8" data-testid="browser-capabilities-shell">
      <VueIsland name="BrowserCapabilities" />
    </div>
  </section>
</template>
