<script setup lang="ts">
import { chunk, orderBy } from "lodash-es";

const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/utility-lodash`;

useSeoMeta({
  title: "Resux lodash-es SSR Utility Demo",
  description: "SSR-safe lodash-es data utilities rendered directly in server output.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const raw = [
  { name: "Aly", score: 92 },
  { name: "Noor", score: 84 },
  { name: "Mona", score: 97 },
  { name: "Ziad", score: 88 },
  { name: "Lina", score: 91 },
];
const sorted = orderBy(raw, ["score"], ["desc"]);
const groupedRows = chunk(sorted, 2);
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">lodash-es Utility Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      lodash-es is SSR-safe in this pattern. Data transforms happen on server and render meaningful HTML immediately.
    </p>

    <section class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <div class="grid gap-3 md:grid-cols-2">
        <ul
          v-for="(group, index) in groupedRows"
          :key="`group-${index}`"
          class="rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-200"
        >
          <li
            v-for="entry in group"
            :key="entry.name"
            class="flex items-center justify-between border-b border-slate-800 py-1 last:border-b-0"
          >
            <span>{{ entry.name }}</span>
            <strong>{{ entry.score }}</strong>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
