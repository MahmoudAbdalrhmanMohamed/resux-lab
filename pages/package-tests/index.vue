<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests`;

useSeoMeta({
  title: "Resux Package Tests",
  description: "SSR-first package compatibility demos with progressive enhancement and resumability-safe patterns.",
  ogTitle: "Resux Package Compatibility",
  twitterCard: "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const pages = [
  { to: "/package-tests/swiper", title: "Swiper", mode: "progressive", trigger: "visible", summary: "SSR cards become a carousel on visibility.", verify: "idle -> active, swiper/js/css/cleanup all become ok/ready." },
  { to: "/package-tests/chart", title: "Chart.js", mode: "progressive", trigger: "visible", summary: "SSR table remains visible if chart JS fails.", verify: "SSR table always visible, enhancement status reaches ready." },
  { to: "/package-tests/echarts", title: "ECharts", mode: "progressive", trigger: "visible", summary: "SSR summary list is visible first, then ECharts enhances canvas.", verify: "status reaches ready and chart renders on client." },
  { to: "/package-tests/animation-gsap", title: "Animation (GSAP)", mode: "progressive", trigger: "idle", summary: "SSR cards stay readable while GSAP adds motion.", verify: "idle trigger runs and cards animate without SSR replacement." },
  { to: "/package-tests/animation-anime", title: "Animation (Anime.js)", mode: "progressive", trigger: "idle", summary: "SSR-first cards with lightweight anime.js enhancement.", verify: "idle trigger runs and cards animate client-side only." },
  { to: "/package-tests/video-player", title: "Video Player", mode: "progressive", trigger: "visible", summary: "Native video is SSR fallback, package may enhance controls.", verify: "native video SSR exists and enhancement status reaches ready." },
  { to: "/package-tests/markdown", title: "Markdown", mode: "ssr", trigger: "idle", summary: "Article content is fully SSR, enhancement is optional.", verify: "SSR article/code visible before JS, status reaches ready." },
  { to: "/package-tests/code-highlight", title: "Code Highlight", mode: "progressive", trigger: "visible", summary: "SSR code block is visible first, then highlight.js styles tokens.", verify: "SSR code stays readable and enhancement status reaches ready." },
  { to: "/package-tests/utility-date-fns", title: "Utility (date-fns)", mode: "ssr", trigger: "n/a", summary: "SSR-safe named imports with date formatting.", verify: "server-rendered formatted date appears in HTML." },
  { to: "/package-tests/utility-lodash", title: "Utility (lodash-es)", mode: "ssr", trigger: "n/a", summary: "SSR-safe data shaping with lodash-es.", verify: "SSR list content renders from lodash transforms." },
  { to: "/package-tests/css-package", title: "CSS Package", mode: "progressive", trigger: "visible", summary: "Package CSS is loaded only where needed.", verify: "Status reaches ready and CSS is applied only on this page." },
  { to: "/package-tests/client-only-map", title: "Client-Only Map Widget", mode: "clientOnly", trigger: "visible", summary: "Server renders a textual fallback while browser widget initializes later.", verify: "fallback is SSR-visible and client widget status reaches ready." },
  { to: "/package-tests/missing-package", title: "Missing Package", mode: "diagnostics", trigger: "interaction", summary: "Friendly runtime error without breaking SSR content.", verify: "Click to trigger; shows friendly error instead of silent pending." },
  { to: "/package-tests/immediate", title: "Immediate Trigger", mode: "trigger", trigger: "immediate", summary: "Runs right after DOM scan without user input.", verify: "Status changes to ready automatically as soon as runtime starts." },
  { to: "/package-tests/page-load", title: "Page-Load Trigger", mode: "trigger", trigger: "page-load", summary: "Runs after the full window load event.", verify: "Status changes to ready after page load even when scan already happened." },
  { to: "/package-tests/manual", title: "Manual Trigger", mode: "trigger", trigger: "manual", summary: "Runs only when useClientEnhancement().activate() is called.", verify: "Stays idle until button click, then becomes ready." },
];

const usageExamples = [
  {
    title: "Progressive content (visible trigger)",
    code: `<ClientEnhance
  name="swiper-carousel"
  trigger="visible"
  demo="swiper"
  :options="{ navigation: true, pagination: true, navigationIcons: 'empty-only' }"
>
  <!-- SSR HTML content stays visible first -->
</ClientEnhance>`,
  },
  {
    title: "Run on first interaction",
    code: `<ClientEnhance name="missing-package-demo" trigger="interaction" demo="missing-package">
  <!-- Click/pointer/focus starts enhancement -->
</ClientEnhance>`,
  },
  {
    title: "Run when browser is idle",
    code: `<ClientEnhance name="animation-demo" trigger="idle" demo="animation">
  <!-- Useful for non-critical polish -->
</ClientEnhance>`,
  },
  {
    title: "Run immediately after scan",
    code: `<ClientEnhance name="immediate-demo" trigger="immediate" demo="immediate">
  <!-- Runs right after runtime scan -->
</ClientEnhance>`,
  },
  {
    title: "Run after full page load",
    code: `<ClientEnhance name="page-load-demo" trigger="page-load" demo="page-load">
  <!-- Runs after window load event -->
</ClientEnhance>`,
  },
  {
    title: "Manual trigger from code",
    code: `const controller = await useClientEnhancement("manual-demo", {
  target: "#manual-enhancement-target",
  trigger: "manual"
});
await controller.activate();`,
  },
  {
    title: "SSR-safe static package import",
    code: `import { format } from "date-fns";
const publishedAt = format(new Date("2026-05-26"), "PPP");`,
  },
  {
    title: "Dynamic module import in enhancement",
    code: `const [{ default: Swiper }, { Navigation, Pagination }] = await Promise.all([
  useClientPackage("swiper"),
  useClientPackage("swiper/modules", { preferDefault: false })
]);`,
  },
];
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Package Compatibility Demos</h1>
    <p class="mt-3 max-w-3xl text-sm text-slate-300">
      These pages keep meaningful HTML in SSR output for SEO/GEO, then apply package enhancements on the client without hydration.
    </p>

    <section class="mt-6 grid gap-4 md:grid-cols-2">
      <article
        v-for="item in pages"
        :key="item.to"
        class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-cyan-300">{{ item.mode }}</p>
        <p class="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">trigger: {{ item.trigger }}</p>
        <h2 class="mt-2 text-xl font-bold text-white">{{ item.title }}</h2>
        <p class="mt-2 text-sm text-slate-300">{{ item.summary }}</p>
        <p class="mt-2 text-xs text-slate-400">{{ item.verify }}</p>
        <ResuxLink :to="item.to" class="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          Open demo
        </ResuxLink>
      </article>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <h2 class="text-2xl font-bold text-white">User-Friendly Usage Examples</h2>
      <p class="mt-2 text-sm text-slate-300">
        Prefer <code>&lt;ClientEnhance /&gt;</code> over raw data attributes. It keeps resumability behavior but gives a cleaner API for app developers.
      </p>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <article
          v-for="example in usageExamples"
          :key="example.title"
          class="rounded-xl border border-slate-700 bg-slate-900/80 p-3"
        >
          <h3 class="text-sm font-semibold text-cyan-300">{{ example.title }}</h3>
          <pre class="mt-2 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200"><code>{{ example.code }}</code></pre>
        </article>
      </div>
    </section>
  </main>
</template>
