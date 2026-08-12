<script setup>
const {
  locale,
  dir,
  locales,
  t,
  tm,
  localePath,
  switchLocalePath,
  setLocale,
} = useI18n();

const navMessages = tm("i18n.nav");
const greeting = computed(() => t("i18n.greeting", { name: "Developer" }));
</script>

<template>
  <main class="p-8 max-w-4xl mx-auto space-y-6" :dir="dir">
    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-wide text-indigo-600">Resux framework i18n</p>
      <h1 id="i18n-title" class="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {{ t("i18n.title") }}
      </h1>
      <p id="i18n-description" class="text-slate-600 dark:text-slate-300">
        {{ t("i18n.description") }}
      </p>
    </div>

    <section id="i18n-container" class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-5">
      <div class="flex flex-wrap gap-3" :dir="dir">
        <button
          v-for="item in locales"
          :id="`lang-${item.code}`"
          :key="item.code"
          type="button"
          class="px-3 py-1 rounded border"
          :class="locale === item.code ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-900'"
          @click="setLocale(item.code)"
        >
          {{ item.name || item.code }}
        </button>
      </div>

      <div class="space-y-2">
        <p id="t-welcome" class="text-xl font-semibold">{{ t("i18n.welcome") }}</p>
        <p id="t-greeting">{{ greeting }}</p>
        <p id="t-nav-home">{{ t("i18n.nav.home") }}</p>
        <p id="i18n-locale" class="font-mono text-sm">locale={{ locale }}</p>
        <p id="i18n-dir" class="font-mono text-sm">dir={{ dir }}</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 text-sm">
        <div class="rounded border p-3">
          <strong>localePath()</strong>
          <div id="locale-path-en" class="font-mono break-all">{{ localePath('/features/i18n', 'en') }}</div>
          <div id="locale-path-ar" class="font-mono break-all">{{ localePath('/features/i18n', 'ar') }}</div>
        </div>
        <div class="rounded border p-3">
          <strong>switchLocalePath()</strong>
          <div id="switch-path-en" class="font-mono break-all">{{ switchLocalePath('en') }}</div>
          <div id="switch-path-ar" class="font-mono break-all">{{ switchLocalePath('ar') }}</div>
        </div>
      </div>

      <pre id="tm-nav" class="rounded bg-slate-950 p-3 text-xs text-slate-100 overflow-auto">{{ JSON.stringify(navMessages, null, 2) }}</pre>
    </section>
  </main>
</template>
