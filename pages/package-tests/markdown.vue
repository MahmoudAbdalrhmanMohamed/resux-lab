<script setup lang="ts">
import { marked } from "marked";

const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/markdown`;

useSeoMeta({
  title: "Resux Markdown SSR Demo",
  description: "SSR-rendered article content with optional client-side markdown/code enhancement.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const markdownSource = `## SSR markdown block

- Semantic HTML is rendered on server.
- Client enhancement is optional.
- No hydration required.

\`\`\`ts
const strategy = "SSR first, enhancement second";
console.log(strategy);
\`\`\`
`;

const renderedMarkdown = marked.parse(markdownSource) as string;
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <ClientEnhance
      class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="markdown-demo"
      trigger="idle"
      demo="markdown"
      as="article"
    >
      <h1 class="text-3xl font-black tracking-tight">Markdown Package Demo</h1>
      <p class="mt-3 text-sm text-slate-300">
        This article text is SSR content. A markdown/highlight package may only enhance presentation.
      </p>
      <p class="mt-3 text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <div class="prose prose-invert mt-4 max-w-none rounded-xl border border-slate-700 bg-slate-900/70 p-4" v-html="renderedMarkdown"></div>
    </ClientEnhance>
  </main>
</template>
