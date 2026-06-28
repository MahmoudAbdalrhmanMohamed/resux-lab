<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/video-player`;

useSeoMeta({
  title: "Resux Video Player Package Demo",
  description: "SSR native video fallback with optional client-side player package enhancement.",
  ogTitle: "Resux Video Player Demo",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Video Player Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      Native video, title, and description are rendered on the server. External player packages may enhance controls on client only.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="video-player-demo"
      trigger="visible"
      demo="video-player"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <h2 class="mt-3 text-xl font-bold">Server-rendered video fallback</h2>
      <p class="mt-2 text-sm text-slate-300">If enhancement fails, this still remains usable and crawlable.</p>
      <video
        class="mt-3 w-full rounded-xl bg-black"
        controls
        poster="/media-test/images/sample-poster.jpg"
        width="1280"
        height="720"
      >
        <source src="/media-test/videos/sample-720.mp4" type="video/mp4">
      </video>
    </ClientEnhance>
  </main>
</template>
