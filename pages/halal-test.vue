<script setup lang="ts">
definePageMeta({ title: "Halal AI and Runtime Config Verification" })
useSeoMeta({
  title: "Resux Safety & Config Playground",
  description: "Playground page for verifying Halal AI policy checks and public vs private runtimeConfig parameters."
})

const config = useRuntimeConfig()

// Access public configuration
const appName = config.public?.appName ?? "Fallback App Name"
const isPrivateExposed = typeof (config as any).privateSecret !== "undefined"
const privateValueString = isPrivateExposed ? (config as any).privateSecret : "Not Exposed (Safe)"

// Simulation parameters for developers to test
const activePolicyDetails = {
  scanRoutes: true,
  scanMeta: true,
  scanContent: true,
  scanRuntimeConfig: true,
  categories: {
    gambling: "block",
    alcohol: "block",
    adultContent: "block",
    ribaFinance: "block",
    drugs: "block",
    violence: "warn"
  }
}
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1fr_22rem]">
    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Runtime Config Verification</p>
      <h1 class="mt-4 text-3xl font-black text-white">Config Leak Protection</h1>
      <p class="mt-3 text-slate-300">
        ResuxJS implements strict boundary separation between public and private config values.
      </p>

      <div class="mt-6 space-y-4">
        <div class="border border-slate-700 bg-slate-800/50 p-4 rounded-lg">
          <p class="text-xs uppercase tracking-wider font-bold text-slate-400">Public App Name</p>
          <p class="text-lg font-mono text-emerald-400 mt-1">{{ appName }}</p>
        </div>

        <div class="border border-slate-700 bg-slate-800/50 p-4 rounded-lg">
          <p class="text-xs uppercase tracking-wider font-bold text-slate-400">Private Secret Exposure Test</p>
          <div class="flex items-center gap-3 mt-1">
            <span 
              class="px-2.5 py-1 rounded text-xs font-bold"
              :class="isPrivateExposed ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'"
            >
              {{ isPrivateExposed ? 'FAILED - LEAKED' : 'PASSED - SECURE' }}
            </span>
            <p class="text-sm font-mono text-slate-300">{{ privateValueString }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="panel block p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Compliance</p>
      <h2 class="mt-3 text-xl font-bold text-white">Halal AI Policy Guide</h2>
      <div class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        <p>The active Resux safety policy verifies the workspace files against the following guidelines:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-400 text-xs">
          <li><strong>Gambling & Casinos</strong>: Prohibited (block)</li>
          <li><strong>Interest / Riba Finance</strong>: Prohibited (block)</li>
          <li><strong>Adult Content / Zina</strong>: Prohibited (block)</li>
          <li><strong>Intoxicants (Alcohol / Drugs)</strong>: Prohibited (block)</li>
          <li><strong>Violence & Exploitation</strong>: Restricted (warning)</li>
        </ul>
        <p class="text-xs text-slate-400 pt-2 border-t border-slate-700">
          To run a build-time compliance check, run <code>npm run build</code> or use <code>resux check</code>.
        </p>
      </div>
    </div>
  </section>
</template>
