<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">LCP Priority Image Test</h1>
    <p class="mt-2 text-sm text-slate-300">
      This page intentionally uses one large priority image only to validate LCP preload, placeholder behavior, and stable layout.
    </p>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <ResuxImg
        src="/media-test/images/hero-large.jpg"
        alt="LCP hero image"
        width="1600"
        height="900"
        priority
        preload
        format="webp"
        quality="82"
        placeholder="blur"
        sizes="(min-width: 1280px) 960px, 100vw"
        class="block w-full overflow-hidden rounded-xl"
      />
    </section>
  </main>
</template>
