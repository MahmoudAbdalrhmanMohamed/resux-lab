<template>
  <main class="mx-auto max-w-6xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">ResuxImg And ResuxPicture Placeholder Test</h1>
    <p class="mt-2 text-sm text-slate-300">
      Images should keep placeholders until real image decode/load completes, including lazy and fallback scenarios.
    </p>

    <section class="mt-8 grid gap-6 md:grid-cols-2">
      <article class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
        <h2 class="text-base font-bold">Priority blur placeholder</h2>
        <ResuxImg
          src="/media-test/images/hero-wide.jpg"
          alt="Priority wide"
          width="1200"
          height="675"
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 560px, 100vw"
          class="mt-3 block w-full overflow-hidden rounded-xl"
        />
      </article>

      <article class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
        <h2 class="text-base font-bold">Lazy skeleton placeholder</h2>
        <ResuxImg
          src="/media-test/images/hero-square.jpg"
          alt="Lazy square"
          width="900"
          height="900"
          lazy
          placeholder="skeleton"
          class="mt-3 block w-full overflow-hidden rounded-xl"
        />
      </article>

      <article class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
        <h2 class="text-base font-bold">Spinner placeholder</h2>
        <ResuxImg
          src="/media-test/images/hero-large.png"
          alt="Spinner placeholder sample"
          width="1280"
          height="720"
          lazy
          placeholder="spinner"
          class="mt-3 block w-full overflow-hidden rounded-xl"
        />
      </article>

      <article class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
        <h2 class="text-base font-bold">Custom placeholder source</h2>
        <ResuxImg
          src="/media-test/images/transparent-logo.png"
          alt="Custom placeholder"
          width="600"
          height="360"
          lazy
          placeholder="/media-test/images/resux-placeholder.svg"
          class="mt-3 block w-full overflow-hidden rounded-xl"
        />
      </article>

      <article class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 md:col-span-2">
        <h2 class="text-base font-bold">ResuxPicture + missing-image fallback</h2>
        <div class="mt-3 grid gap-4 md:grid-cols-2">
          <ResuxPicture
            src="/media-test/images/hero-large.jpg"
            alt="Responsive picture sample"
            widths="480,960,1440"
            formats="avif,webp"
            width="1440"
            height="810"
            lazy
            placeholder="blur"
            class="block w-full overflow-hidden rounded-xl"
          />
          <ResuxImg
            src="/media-test/images/missing-image.jpg"
            fallback-src="/media-test/images/resux-placeholder.jpg"
            alt="Missing image fallback"
            width="900"
            height="560"
            lazy
            placeholder="skeleton"
            class="block w-full overflow-hidden rounded-xl"
          />
        </div>
      </article>
    </section>
  </main>
</template>
