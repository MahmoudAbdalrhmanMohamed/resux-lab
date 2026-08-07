<script setup lang="ts">
const config = useRuntimeConfig();
const appOrigin = String(config.public?.appOrigin ?? "http://localhost:3000");
const canonical = `${appOrigin}/package-tests/manual`;
const activationResult = ref("not-triggered");
const activationDone = ref(false);

useSeoMeta({
  title: "Resux Manual Trigger Demo",
  description: "Manual trigger enhancement test using useClientEnhancement().",
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});

async function activateManualEnhancement() {
  if (activationDone.value) {
    activationResult.value = "already-activated";
    return;
  }
  try {
    const controller = await useClientEnhancement("manual-demo", {
      target: "#manual-enhancement-target",
      trigger: "manual",
    });
    await controller.activate();
    activationDone.value = true;
    activationResult.value = "activated";
  } catch (error) {
    activationResult.value = String(error);
  }
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-slate-100">
    <h1 class="text-3xl font-black tracking-tight">Manual Trigger Demo</h1>
    <p class="mt-3 text-sm text-slate-300">
      This page validates <code>data-trigger="manual"</code>. SSR content is visible first and enhancement runs only when requested.
    </p>

    <ClientEnhance
      id="manual-enhancement-target"
      class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
      name="manual-demo"
      trigger="manual"
      demo="manual"
    >
      <p class="text-xs text-slate-300">
        Enhancement status: <strong data-rx-package-status>idle</strong>
      </p>
      <p class="mt-2 text-xs text-slate-300">
        Manual API call result: <strong>{{ activationResult }}</strong>
      </p>
      <button
        type="button"
        class="mt-4 rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
        @click="activateManualEnhancement"
      >
        Activate enhancement manually
      </button>
    </ClientEnhance>
  </main>
</template>
