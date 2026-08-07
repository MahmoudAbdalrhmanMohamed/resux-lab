<script setup lang="ts">
definePageMeta({ title: "Resux hero video priority test" });

useSeoMeta({
  title: "Resux Hero Video Priority Test",
  description: "SSR-first hero video route used to validate ResuxVideo preload and interaction behavior.",
});
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">ResuxVideo Hero Priority Route</h1>
    <p class="mt-2 text-sm text-slate-300">
      Dedicated route for validating one hero-priority video with SSR-first content, valid video preload, and custom controls.
    </p>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <h2 class="text-lg font-bold">Single hero video</h2>
      <p class="mt-1 text-sm text-slate-400">
        Framework-level ResuxVideo behavior only. No page-specific video runtime logic is added here.
      </p>
      <ResuxVideo
        src="/media-test/videos/sample-720.mp4"
        poster="/media-test/videos/sample-poster.jpg"
        width="1600"
        height="900"
        controls
        controls-mode="custom"
        controls-load="eager"
        icons-load="eager"
        :lazy="false"
        loading="eager"
        preload="metadata"
        hero
        priority
        preload-link
        skip-seconds="10"
        side-click-skip
        click-to-play
        double-click-fullscreen
        class="mt-4"
        title="Hero priority sample video"
      />

      <ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
        <li>Exactly one hero video on this route</li>
        <li>Includes a valid preload link with <code>as=&quot;video&quot;</code></li>
        <li>Center click toggles play/pause, center double click toggles fullscreen</li>
        <li>Left/right click zones skip backward/forward</li>
      </ul>
    </section>
  </main>
</template>
