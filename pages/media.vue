<script setup lang="ts">
definePageMeta({ layout: "dashboard", title: "Resux media components" });

const none = undefined;
const nil = null;
const empty = "";

const buildImage = useResuxImage();
const cachedGeneratedUrl = buildImage("/media-test/images/hero-large.jpg", {
  width: 1400,
  format: "webp",
  quality: 88,
  cache: "1d",
});
const cachedExpiryUrl = buildImage("/media-test/images/hero-square.jpg", {
  width: 1200,
  format: "avif",
  quality: 90,
  cache: { maxAge: "7d" },
});
const noFormatNoQualityUrl = buildImage("/media-test/images/hero-large.jpg", {
  width: 1200,
  cache: true,
  modifiers: { format: false, quality: false },
});

const sharedSizes = "(min-width: 1280px) 40vw, (min-width: 768px) 84vw, 96vw";
const mediaIntrinsicSizes: Record<string, { width: number; height: number }> = {
  "/media-test/images/hero-large.jpg": { width: 2200, height: 1467 },
  "/media-test/images/hero-large.png": { width: 2200, height: 1467 },
  "/media-test/images/hero-wide.jpg": { width: 2400, height: 1080 },
  "/media-test/images/hero-square.jpg": { width: 1400, height: 1400 },
};

function inferMediaHeight(src: string | undefined, width: number | undefined): number | undefined {
  if (!src || !width) {
    return undefined;
  }
  const size = mediaIntrinsicSizes[src];
  if (!size) {
    return undefined;
  }
  return Math.max(1, Math.round((width * size.height) / size.width));
}

function inferMediaWidth(src: string | undefined): number | undefined {
  if (!src) {
    return undefined;
  }
  return mediaIntrinsicSizes[src]?.width;
}

const imgCases: Array<Record<string, any>> = [
  {
    id: "img-lazy-default",
    title: "Lazy image with default Resux placeholder",
    propsCode: `lazy loading="lazy" :placeholder="true" placeholderClass="bg-slate-800/70"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Lazy image with default placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    placeholderClass: "bg-slate-800/70",
    placeholderStyle: "filter: saturate(0.8)",
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-lazy-custom-placeholder",
    title: "Lazy image with custom placeholder image",
    propsCode: `lazy placeholder="/media-test/images/custom-placeholder.jpg"`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Lazy image with custom placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/images/custom-placeholder.jpg",
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-lazy-text-placeholder",
    title: "Lazy image with text placeholder",
    propsCode: `lazy placeholder="Loading image..."`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Lazy image with text placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: "Loading image...",
    width: 1200,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-eager-no-placeholder",
    title: "Eager image with no placeholder",
    propsCode: `loading="eager" placeholder=undefined`,
    src: "/media-test/images/hero-large.png",
    alt: "Eager PNG image",
        lazy: true,
    loading: "lazy",
    
    placeholder: none,
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-broken-fallback",
    title: "Broken image with fallbackSrc",
    propsCode: `src="/media-test/images/missing.jpg" fallbackSrc="/media-test/images/hero-square.jpg" width="860" fit="cover"`,
    src: "/media-test/images/missing.jpg",
    alt: "Broken image fallback test",
    fallbackSrc: "/media-test/images/hero-square.jpg",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 860,
    sizes: none,
    cache: false,
    expected: "Expected: one 404, then fallback",
  },
  {
    id: "img-broken-placeholder",
    title: "Broken image with placeholder only",
    propsCode: `src="/media-test/images/missing-placeholder.jpg" lazy :placeholder="true"`,
    src: "/media-test/images/missing-placeholder.jpg",
    alt: "Broken image placeholder test",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 860,
    sizes: none,
    cache: false,
    expected: "Expected: one 404, then placeholder",
  },
  {
    id: "img-format-undefined-quality-undefined",
    title: "format=undefined, quality=undefined",
    propsCode: `:format="undefined" :quality="undefined" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Undefined format and quality",
    format: none,
    quality: none,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: "/resux-placeholder.svg",
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-format-null-quality-null",
    title: "format=null, quality=null",
    propsCode: `:format="null" :quality="null" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Null format and quality",
    format: nil,
    quality: nil,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-format-empty-quality-empty",
    title: "format=\"\", quality=\"\"",
    propsCode: `format="" quality="" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Empty format and quality",
    format: empty,
    quality: empty,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-cached-transform",
    title: "Cached transformed image",
    propsCode: `format="webp" quality=88 cache="1d"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Cached transformed webp",
    format: "webp",
    quality: 88,
    cache: "1d",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1400,
    sizes: sharedSizes,
  },
  {
    id: "img-original-vs-transform",
    title: "Original vs transformed quality comparison",
    propsCode: `format=null quality=null vs explicit format="webp" quality=88`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Original quality comparison",
    format: nil,
    quality: nil,
    modifiers: { format: false, quality: false },
    cache: false,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1400,
    sizes: sharedSizes,
  },
].map((entry) => ({
  ...entry,
  height: entry.height ?? inferMediaHeight(entry.src ?? entry.fallbackSrc, entry.width),
}));

const pictureCases: Array<Record<string, any>> = [
  {
    id: "pic-lazy-default-placeholder",
    title: "Lazy picture with default Resux placeholder",
    propsCode: `lazy :placeholder="true" placeholderClass="bg-slate-800/60" formats="avif,webp,jpg"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Lazy picture default placeholder",
    formats: "avif,webp,jpg",
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    placeholderClass: "bg-slate-800/60",
    placeholderStyle: "filter: saturate(0.9)",
    cache: false,
  },
  {
    id: "pic-lazy-custom-placeholder",
    title: "Lazy picture with custom placeholder image",
    propsCode: `lazy placeholder="/media-test/images/custom-placeholder.jpg"`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Lazy picture custom placeholder",
    formats: "webp,jpg",
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: "/media-test/images/custom-placeholder.jpg",
    cache: false,
  },
  {
    id: "pic-lazy-text-placeholder",
    title: "Lazy picture with text placeholder",
    propsCode: `lazy placeholder="Loading picture..."`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Lazy picture text placeholder",
    formats: "webp,jpg",
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: "Loading picture...",
    cache: false,
  },
  {
    id: "pic-multiple-sources",
    title: "Picture with multiple source definitions",
    propsCode: `:sources="[{ src, format:'webp', media:'(min-width:768px)' }, { src, format:null, media:'(max-width:767px)' }]"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture explicit multiple sources",
    sources: [
      {
        src: "/media-test/images/hero-wide.jpg",
        format: "webp",
        media: "(min-width: 768px)",
        widths: "640,1024,1600",
        sizes: "(min-width: 1280px) 44vw, 92vw",
      },
      {
        src: "/media-test/images/hero-square.jpg",
        format: nil,
        media: "(max-width: 767px)",
        widths: "320,480,720",
        sizes: "92vw",
      },
    ],
    fallback: "/media-test/images/hero-large.jpg",
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-fallback-image",
    title: "Picture fallback image when source fails",
    propsCode: `src="/media-test/images/missing-picture.jpg" fallback="/media-test/images/hero-square.jpg" fallbackSrc="/media-test/images/hero-square.jpg"`,
    src: "/media-test/images/missing-picture.jpg",
    fallback: "/media-test/images/hero-square.jpg",
    fallbackSrc: "/media-test/images/hero-square.jpg",
    alt: "Broken picture fallback test",
    formats: "webp,jpg",
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
    expected: "Expected: one 404, then fallback",
  },
  {
    id: "pic-format-null",
    title: "Picture format=null (no conversion)",
    propsCode: `:format="null" :quality="88" modifiers={ format:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture format null",
    format: nil,
    quality: 88,
    modifiers: { format: false },
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-quality-null",
    title: "Picture quality=null (no compression)",
    propsCode: `formats="webp,jpg" :quality="null" modifiers={ quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture quality null",
    formats: "webp,jpg",
    quality: nil,
    modifiers: { quality: false },
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-cached-transform",
    title: "Cached transformed picture",
    propsCode: `formats="avif,webp,jpg" quality=88 cache="7d"`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Cached transformed picture",
    formats: "avif,webp,jpg",
    quality: 88,
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    cache: "7d",
  },
  {
    id: "pic-cache-false",
    title: "Non-cached transformed picture",
    propsCode: `formats="webp,jpg" quality=88 :cache="false"`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Non-cached transformed picture",
    formats: "webp,jpg",
    quality: 88,
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
].map((entry) => ({
  ...entry,
  width: entry.width ?? inferMediaWidth(entry.src ?? entry.fallback ?? entry.fallbackSrc),
  height: entry.height
    ?? inferMediaHeight(
      entry.src ?? entry.fallback ?? entry.fallbackSrc,
      entry.width ?? inferMediaWidth(entry.src ?? entry.fallback ?? entry.fallbackSrc),
    ),
}));

const videoCases: Array<Record<string, any>> = [
  {
    id: "video-eager-controls",
    title: "Eager video with controls",
    propsCode: `src + controls + preload=\"metadata\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    preload: "metadata",
        lazy: true,
    loading: "lazy",
    
    poster: "/media-test/videos/sample-poster.jpg",
  },
  {
    id: "video-lazy-poster",
    title: "Lazy video with poster",
    propsCode: `lazy poster controls`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-custom-controls-theme",
    title: "Lazy video with themed custom controls",
    propsCode: `lazy controls controlsAccent="#22d3ee" controlsBackground="rgba(15,23,42,.80)" controlsColor="#f8fafc"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
    controlsColor: "#f8fafc",
    controlsBackground: "rgba(15,23,42,.80)",
    controlsAccent: "#22d3ee",
    controlsIconPlay: ">",
    controlsIconPause: "||",
    controlsIconMute: "M",
    controlsIconUnmute: "S",
    controlsIconFullscreen: "[ ]",
    controlsIconExitFullscreen: "X",
  },
  {
    id: "video-lazy-default-placeholder",
    title: "Lazy video with default Resux placeholder",
    propsCode: `lazy :placeholder=\"true\" controls`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-skeleton-placeholder",
    title: "Lazy video with skeleton placeholder",
    propsCode: `lazy placeholder=\"/media-test/videos/placeholder.jpg\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/videos/placeholder.jpg",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-placeholder-image",
    title: "Lazy video with custom placeholder image",
    propsCode: `lazy placeholder=\"/media-test/images/custom-placeholder.jpg\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/images/custom-placeholder.jpg",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-placeholder-text",
    title: "Lazy video with text placeholder",
    propsCode: `lazy placeholder=\"Loading video...\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "Loading video...",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-autoplay-loop",
    title: "Lazy autoplay muted loop video",
    propsCode: `lazy autoplay muted loop playsinline`,
    src: "/media-test/videos/sample-video.mp4",
    controls: false,
    autoplay: true,
    muted: true,
    loop: true,
    playsinline: true,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    preload: "auto",
    poster: "/media-test/videos/sample-poster.jpg",
  },
  {
    id: "video-lazy-multi-source",
    title: "Lazy video with multiple sources",
    propsCode: `:sources="[{ src:'/sample-video-alt.mp4', type:'video/mp4' }, { src:'/sample-video.mp4', type:'video/mp4' }]"`,
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    sources: [
      { src: "/media-test/videos/sample-video-alt.mp4", type: "video/mp4" },
      { src: "/media-test/videos/sample-video.mp4", type: "video/mp4" },
    ],
  },
  {
    id: "video-grid-card",
    title: "Lazy video inside responsive card grid",
    propsCode: `lazy aspect-ratio=\"16 / 9\" class=\"card media\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    aspectRatio: "16 / 9",
    preload: "metadata",
  },
  {
    id: "video-broken-src",
    title: "Broken video src with safe error handling",
    propsCode: `src=\"/media-test/videos/missing.mp4\" fallbackPoster=\"/media-test/videos/sample-poster.jpg\"`,
    src: "/media-test/videos/missing.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "Video failed to load",
    fallbackPoster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
    expected: "Expected: video placeholder after failed video",
  },
];
</script>

<template>
  <section class="grid gap-4 overflow-x-hidden sm:gap-6 lg:gap-8">
    <header class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">Resux Media QA</p>
      <h1 class="mt-3 text-2xl font-black text-white sm:text-3xl lg:text-4xl">ResuxImg, ResuxPicture, ResuxVideo</h1>
      <p class="mt-4 max-w-4xl text-sm text-slate-300 sm:text-base">
        Responsive media regression page for lazy loading, placeholders, fallback behavior, cache URLs, and quality/format handling.
        Open browser network tab and verify lazy assets are not requested before scrolling into view.
      </p>
      <div class="mt-5 grid gap-2 text-xs font-semibold text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: lazy item should not request before scroll</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: one 404, then fallback</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: video placeholder after failed video</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: works after client-side navigation, no hard refresh</span>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">Cache URL (1d)</p>
          <p class="mt-2 break-all">{{ cachedGeneratedUrl }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">Cache URL (7d)</p>
          <p class="mt-2 break-all">{{ cachedExpiryUrl }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">No Format/Quality URL</p>
          <p class="mt-2 break-all">{{ noFormatNoQualityUrl }}</p>
        </div>
      </div>
    </header>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">ResuxImg</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Lazy placeholders, fallback, format and cache behavior</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in imgCases"
          :key="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-cyan-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-cyan-100">{{ entry.expected }}</p>
          <ResuxImg
            class="mt-3 h-auto w-full rounded-2xl border border-white/10 object-cover"
            :src="entry.src"
            :alt="entry.alt"
            :width="entry.width"
            :height="entry.height"
            :sizes="entry.sizes"
            :quality="entry.quality"
            :format="entry.format"
            :cache="entry.cache"
            :modifiers="entry.modifiers"
            :lazy="entry.lazy"
            :loading="entry.loading"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0"
            :placeholder="entry.placeholder"
            :placeholder-class="entry.placeholderClass"
            :placeholder-style="entry.placeholderStyle"
            :fallback-src="entry.fallbackSrc"
            decoding="async"
            fit="cover"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-purple-200 sm:text-sm">ResuxPicture</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Multi-source picture, placeholder, fallback, quality controls</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in pictureCases"
          :key="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-purple-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-purple-100">{{ entry.expected }}</p>
          <ResuxPicture
            class="mt-3 h-auto w-full rounded-2xl border border-white/10 object-cover"
            :src="entry.src"
            :sources="entry.sources"
            :fallback="entry.fallback"
            :fallback-src="entry.fallbackSrc"
            :alt="entry.alt"
            :formats="entry.formats"
            :format="entry.format"
            :quality="entry.quality"
            :width="entry.width"
            :height="entry.height"
            :cache="entry.cache"
            :modifiers="entry.modifiers"
            :sizes="entry.sizes"
            :widths="entry.widths"
            :lazy="true"
            loading="lazy"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0"
            :placeholder="entry.placeholder"
            :placeholder-class="entry.placeholderClass"
            :placeholder-style="entry.placeholderStyle"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-emerald-200 sm:text-sm">ResuxVideo</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Lazy load, poster/placeholder/fallback, multi-source</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in videoCases"
          :key="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-emerald-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-emerald-100">{{ entry.expected }}</p>
          <ResuxVideo
            class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
            :src="entry.src"
            :sources="entry.sources"
            :poster="entry.poster"
            :fallback-poster="entry.fallbackPoster"
            :width="entry.width ?? 1280"
            :height="entry.height ?? 720"
            :controls="entry.controls"
            :autoplay="entry.autoplay"
            :muted="entry.muted"
            :loop="entry.loop"
            :playsinline="entry.playsinline"
            :preload="entry.preload"
            :lazy="entry.lazy"
            :loading="entry.loading"
            :placeholder="entry.placeholder"
            :aspect-ratio="entry.aspectRatio ?? '16 / 9'"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0.01"
            :title="entry.title"
            :aria-label="entry.title"
            :controls-color="entry.controlsColor"
            :controls-background="entry.controlsBackground"
            :controls-accent="entry.controlsAccent"
            :controls-icon-play="entry.controlsIconPlay"
            :controls-icon-pause="entry.controlsIconPause"
            :controls-icon-mute="entry.controlsIconMute"
            :controls-icon-unmute="entry.controlsIconUnmute"
            :controls-icon-fullscreen="entry.controlsIconFullscreen"
            :controls-icon-exit-fullscreen="entry.controlsIconExitFullscreen"
            :native-controls="entry.nativeControls"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-amber-200 sm:text-sm">Lazy Network Check</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Far below fold lazy video</h2>
      <p class="mt-3 text-sm text-slate-300">
        The spacer below keeps this example off-screen initially. Confirm in network tab that the video request starts only after scroll.
      </p>
      <div class="mt-5 h-[62vh] rounded-2xl border border-dashed border-white/15 bg-slate-900/45" />
      <article class="mt-5 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4">
        <p class="text-sm font-semibold text-white">Lazy video far down page</p>
        <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-amber-100">lazy loading="lazy" root-margin="0px 0px" threshold="0.01"</pre>
        <ResuxVideo
          src="/media-test/videos/sample-video-lazy.mp4"
          poster="/media-test/videos/sample-poster.jpg"
          :width="1280"
          :height="720"
          aspect-ratio="16 / 9"
          controls
          lazy
          loading="lazy"
          root-margin="0px 0px"
          threshold="0.01"
          placeholder="Scroll-triggered lazy video"
          preload="metadata"
          class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
          aria-label="Far below fold lazy video"
          title="Far below fold lazy video"
        />
      </article>
    </section>
  </section>
</template>
