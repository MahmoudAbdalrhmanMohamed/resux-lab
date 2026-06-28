<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/swiper`;

useSeoMeta({
  title: "Resux Swiper Progressive Demo",
  description: "SSR-first Swiper integration in Resux with progressive enhancement and resumability-safe lifecycle.",
  ogTitle: "Resux Swiper Demo",
  twitterCard: "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

const swiperOptions = {
  slidesPerView: 1,
  spaceBetween: 16,
  breakpoints: {
    640: { slidesPerView: 1.2, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 24 },
  },
  navigation: true,
  pagination: true,
  navigationIcons: "empty-only",
};

</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <section class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 md:p-6">
      <h1 class="text-3xl font-black tracking-tight">Swiper Progressive Enhancement</h1>
      <p class="mt-3 max-w-3xl text-sm text-slate-300">
        This page server-renders complete semantic slide cards for SEO/GEO, then enhances only the carousel behavior on the client.
      </p>

      <ClientEnhance
        class="mt-6"
        name="swiper-carousel"
        trigger="visible"
        mode="progressive"
        :options="swiperOptions"
        no-cls
        reserve-height="460px"
        demo="swiper"
      >
        <p class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
          Enhancement status: <strong data-rx-package-status>idle</strong>
        </p>
        <p class="mt-2 rounded-lg border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100" data-rx-package-error>
          No errors.
        </p>
        <ul class="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-2">
          <li class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">SSR content rendered: <strong data-rx-swiper-status="ssr">pending</strong></li>
          <li class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">Swiper loaded: <strong data-rx-swiper-status="swiper-js">pending</strong></li>
          <li class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">CSS loaded: <strong data-rx-swiper-status="swiper-css">pending</strong></li>
          <li class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">Enhancement active: <strong data-rx-swiper-status="active">pending</strong></li>
          <li class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">Cleanup ready: <strong data-rx-swiper-status="cleanup">pending</strong></li>
        </ul>

        <div class="rx-swiper-shell mt-4">
          <div class="swiper rx-swiper-viewport">
            <div class="swiper-wrapper rx-swiper-fallback-track">
              <div class="swiper-slide rx-swiper-fallback-slide">
                <article class="rx-swiper-card rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                  <ResuxImg
                    src="/media-test/images/hero-wide.jpg"
                    alt="Wide hero sample image"
                    width="640"
                    height="360"
                    :lazy="false"
                    loading="eager"
                    placeholder="skeleton"
                    class="rx-swiper-media rounded-lg"
                  />
                <h2 class="mt-3 text-lg font-bold text-white">SSR card one</h2>
                <p class="mt-2 text-sm text-slate-300">Content is visible in server HTML before Swiper JavaScript loads.</p>
                <ResuxLink to="/media-test/video" class="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Read more
                </ResuxLink>
              </article>
            </div>
              <div class="swiper-slide rx-swiper-fallback-slide">
                <article class="rx-swiper-card rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                  <ResuxImg
                    src="/media-test/images/hero-square.jpg"
                    alt="Square hero sample image"
                    width="640"
                    height="360"
                    lazy
                    loading="lazy"
                    placeholder="skeleton"
                    class="rx-swiper-media rounded-lg"
                  />
                <h2 class="mt-3 text-lg font-bold text-white">Responsive fallback</h2>
                <p class="mt-2 text-sm text-slate-300">If JavaScript fails, this stays a readable responsive list with real links.</p>
                <ResuxLink to="/media-test/images" class="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Read more
                </ResuxLink>
              </article>
            </div>
              <div class="swiper-slide rx-swiper-fallback-slide">
                <article class="rx-swiper-card rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                  <ResuxImg
                    src="/media-test/images/sample-poster.jpg"
                    alt="Video poster sample image"
                    width="640"
                    height="360"
                    lazy
                    loading="lazy"
                    placeholder="skeleton"
                    class="rx-swiper-media rounded-lg"
                  />
                <h2 class="mt-3 text-lg font-bold text-white">Client enhancement</h2>
                <p class="mt-2 text-sm text-slate-300">Visible trigger activates Swiper without hydrating the whole page.</p>
                <ResuxLink to="/package-tests" class="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Read more
                </ResuxLink>
              </article>
            </div>
              <div class="swiper-slide rx-swiper-fallback-slide">
                <article class="rx-swiper-card rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                  <ResuxImg
                    src="/media-test/images/small-thumb.jpg"
                    alt="Small thumbnail sample image"
                    width="640"
                    height="360"
                    lazy
                    loading="lazy"
                    placeholder="skeleton"
                    class="rx-swiper-media rounded-lg"
                  />
                <h2 class="mt-3 text-lg font-bold text-white">Route-safe cleanup</h2>
                <p class="mt-2 text-sm text-slate-300">Enhancement instances are disposed on route change and recreated safely.</p>
                <ResuxLink to="/performance" class="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Read more
                </ResuxLink>
              </article>
            </div>
              <div class="swiper-slide rx-swiper-fallback-slide">
                <article class="rx-swiper-card rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                  <ResuxImg
                    src="/media-test/images/hero-square.jpg"
                    alt="Additional demo image for navigation overflow"
                    width="640"
                    height="360"
                    lazy
                    loading="lazy"
                    placeholder="skeleton"
                    class="rx-swiper-media rounded-lg"
                  />
                <h2 class="mt-3 text-lg font-bold text-white">Navigation check</h2>
                <p class="mt-2 text-sm text-slate-300">Extra slide ensures next/prev controls can move on wider screens too.</p>
                <ResuxLink to="/package-tests/manual" class="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Read more
                </ResuxLink>
              </article>
            </div>
          </div>
            <div class="rx-swiper-controls mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              class="swiper-button-prev rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200"
              aria-label="Previous slide"
            >
              Prev
            </button>
              <div class="swiper-pagination rx-swiper-pagination text-xs text-slate-400"></div>
            <button
              type="button"
              class="swiper-button-next rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200"
              aria-label="Next slide"
            >
              Next
            </button>
            </div>
          </div>
        </div>
        <div data-rx-swiper-anchor class="h-px w-full"></div>
      </ClientEnhance>
    </section>
  </main>
</template>

<style scoped>
.rx-swiper-shell {
  contain: layout paint;
}

.rx-swiper-viewport {
  min-height: 390px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}

.rx-swiper-fallback-track {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: stretch;
  gap: 1rem;
}

.rx-swiper-fallback-slide {
  flex: 0 0 100%;
  min-width: 0;
}

.rx-swiper-card {
  min-height: 360px;
  display: flex;
  flex-direction: column;
}

.rx-swiper-media {
  width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.rx-swiper-controls {
  min-height: 44px;
}

.rx-swiper-pagination {
  min-height: 20px;
  min-width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  position: static;
  inset: auto;
  width: auto;
  height: auto;
  min-width: 72px;
  min-height: 36px;
  margin: 0;
  color: inherit;
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  content: none;
}

:deep(.swiper-pagination) {
  position: static;
  inset: auto;
  transform: none;
}

[data-rx-swiper-enhancing="true"] .rx-swiper-viewport,
[data-resux-enhancement-status="active"] .rx-swiper-viewport {
  overflow: hidden;
}

[data-rx-swiper-enhancing="true"] .rx-swiper-fallback-track,
[data-resux-enhancement-status="active"] .rx-swiper-fallback-track {
  gap: 0;
}

@media (min-width: 768px) {
  .rx-swiper-viewport {
    min-height: 420px;
  }

  .rx-swiper-fallback-slide {
    flex-basis: calc((100% - 1rem) / 2);
  }
}

@media (min-width: 1024px) {
  .rx-swiper-fallback-slide {
    flex-basis: calc((100% - 2rem) / 3);
  }
}

@media (min-width: 1280px) {
  .rx-swiper-fallback-slide {
    flex-basis: calc((100% - 3rem) / 4);
  }
}
</style>
