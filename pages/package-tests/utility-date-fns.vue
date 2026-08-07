<script setup lang="ts">
import { format, formatDistanceToNowStrict } from "date-fns";

const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/utility-date-fns`;
const publishedAt = new Date("2026-05-26T09:00:00.000Z");

useSeoMeta({
  title: "Resux date-fns SSR Utility Demo",
  description: "SSR-safe date-fns utility package usage in Resux.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const readableDate = format(publishedAt, "PPP p");
const relativeDate = formatDistanceToNowStrict(publishedAt, { addSuffix: true });
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">date-fns Utility Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      date-fns is SSR-safe, so this output is rendered directly on the server with no client enhancement required.
    </p>

    <section class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <p class="text-sm text-slate-300">Readable date:</p>
      <code class="mt-2 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">{{ readableDate }}</code>
      <p class="mt-4 text-sm text-slate-300">Relative date:</p>
      <code class="mt-2 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">{{ relativeDate }}</code>
    </section>
  </main>
</template>
