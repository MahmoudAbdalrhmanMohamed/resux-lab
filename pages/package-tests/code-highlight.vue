<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/code-highlight`;

useSeoMeta({
  title: "Resux Code Highlight Progressive Demo",
  description: "SSR-first code block with highlight.js enhancement on visible trigger.",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Code Highlight Package Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      The code block below is SSR text first. highlight.js only improves visual syntax styling in the browser.
    </p>

    <ClientEnhance
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="code-highlight-demo"
      trigger="visible"
      demo="code-highlight"
    >
      <p class="text-xs text-slate-300">Enhancement status: <strong data-rx-package-status>idle</strong></p>
      <pre class="mt-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200"><code data-rx-code-block class="language-ts">const mode = "progressive";
const run = async () => {
  const pkg = await useClientPackage("highlight.js", { preferDefault: false });
  return pkg;
};</code></pre>
    </ClientEnhance>
  </main>
</template>
