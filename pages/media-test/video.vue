<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">ResuxVideo Hero Section Test</h1>
    <p class="mt-2 text-sm text-slate-300">
      Single hero video test for left/center/right click zones, controls safety, lazy loading, and loading placeholder behavior.
    </p>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <h2 class="text-lg font-bold">Hero video</h2>
      <p class="mt-1 text-sm text-slate-400">
        Uses framework-level ResuxVideo behavior only. No page-level video event logic is added here.
      </p>
      <ResuxVideo
        src="/media-test/videos/sample-720.mp4"
        poster="/media-test/images/sample-poster.jpg"
        width="1600"
        height="900"
        controls
        controls-mode="custom"
        controls-load="lazy"
        icons-load="lazy"
        lazy
        placeholder="skeleton"
        skip-seconds="10"
        side-click-skip
        click-to-play
        double-click-fullscreen
        class="mt-4"
      />

      <ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
        <li>Left 1/3 click: skip backward</li>
        <li>Middle 1/3 click: play/pause</li>
        <li>Middle 1/3 double click: fullscreen</li>
        <li>Right 1/3 click: skip forward</li>
        <li>Progress and custom controls must remain interactive</li>
      </ul>
    </section>
  </main>
</template>
