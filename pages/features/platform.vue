<script setup>
import { Icon, iconRegistry } from "resuxjs/icons";
import { googleFont } from "resuxjs/fonts";

definePageMeta({ layout: "dashboard", title: "Resux Fonts & Icons" });

const fontExample = googleFont({
  name: "Inter",
  weights: [400, 700],
  display: "swap",
  strategy: "eager",
});

const bundledIcons = [
  "solar:check-circle-linear",
  "material-symbols:warning",
  "lucide-lab:flower-lotus",
].filter((name) => Boolean(iconRegistry[name]));
</script>

<template>
  <section class="grid gap-6 w-full">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">Public asset modules</p>
      <h1 class="mt-4 text-4xl font-black text-white">Resux Fonts & Icons</h1>
      <p class="mt-4 max-w-3xl text-slate-300">
        This page consumes <code>resuxjs/fonts</code> and <code>resuxjs/icons</code> directly so the lab catches packaging,
        SSR, runtime-config, and rendering regressions in the published package.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article class="panel p-6">
        <h2 class="text-xl font-bold text-white">Bundled icon rendering</h2>
        <div class="mt-5 flex items-center gap-4 text-emerald-300">
          <Icon name="solar:check-circle-linear" size="2rem" data-testid="platform-icon" />
          <span>solar:check-circle-linear</span>
        </div>
        <p class="mt-4 text-sm text-slate-400">Bundled icons detected: {{ bundledIcons.length }}</p>
      </article>

      <article class="panel p-6">
        <h2 class="text-xl font-bold text-white">Google font configuration</h2>
        <p class="mt-5 text-slate-300">Family: {{ fontExample.name }}</p>
        <p class="mt-2 text-sm text-slate-400">Weights: {{ fontExample.weights?.join(", ") }}</p>
        <p class="mt-2 text-sm text-slate-400">Display: {{ fontExample.display }}</p>
      </article>
    </div>
  </section>
</template>
