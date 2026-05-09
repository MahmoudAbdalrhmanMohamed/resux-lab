<script setup lang="ts">
definePageMeta({ layout: "dashboard", title: "Image pipeline + route loader" });

const buildImage = useResuxImage();
const optimizedHeroUrl = buildImage("/images/hero-large.jpg", {
  width: 960,
  quality: 78,
  format: "webp",
});

const gallery = [
  { src: "/images/gallery-1.jpg", alt: "Gallery sample one" },
  { src: "/images/gallery-2.jpg", alt: "Gallery sample two" },
  { src: "/images/gallery-3.jpg", alt: "Gallery sample three" },
];
</script>

<template>
  <section class="grid gap-6">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">New media features</p>
      <h1 class="mt-4 text-4xl font-black text-white">Image optimization and route loading indicator</h1>
      <p class="mt-4 max-w-3xl text-slate-300">
        This page exercises <code>ResuxImg</code>, <code>ResuxPicture</code>, and <code>useResuxImage</code>.
        Navigate between routes using the links below to verify the new loading indicator behavior.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <ResuxLink to="/async" class="btn-primary">Navigate to async page</ResuxLink>
        <ResuxLink to="/performance" class="btn-secondary">Navigate to performance page</ResuxLink>
        <ResuxLink to="/state" class="btn-secondary">Navigate to state page</ResuxLink>
      </div>
      <p class="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">useResuxImage output</p>
      <pre class="mt-3 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-cyan-100">{{ optimizedHeroUrl }}</pre>
    </div>

    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">ResuxImg</p>
      <h2 class="mt-4 text-2xl font-black text-white">Single optimized image with preload</h2>
      <ResuxImg
        src="/images/hero-large.jpg"
        alt="Large hero sample"
        width="560"
        sizes="(min-width: 1280px) 960px, 100vw"
        densities="1,2"
        format="webp"
        priority="true"
        class="mt-6 h-auto w-full rounded-3xl border border-white/15"
      />
    </div>

    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-purple-200">ResuxPicture</p>
      <h2 class="mt-4 text-2xl font-black text-white">Responsive sources with AVIF and WebP</h2>
      <ResuxPicture
        src="/images/picture-test.jpg"
        alt="Picture conversion sample"
        widths="320,640,960"
        formats="avif,webp,jpg"
        sizes="(min-width: 1024px) 50vw, 100vw"
        class="mt-6 h-auto w-full rounded-3xl border border-white/15"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <ResuxImg
        v-for="entry in gallery"
        :key="entry.src"
        :src="entry.src"
        :alt="entry.alt"
        width="360"
        sizes="(min-width: 1024px) 33vw, 100vw"
        loading="lazy"
        class="h-full w-full rounded-3xl border border-white/15 object-cover"
      />
    </div>
  </section>
</template>
