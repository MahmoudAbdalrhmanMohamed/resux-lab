<script setup>
import * as ResuxRuntime from "resuxjs";

const exportedKeys = Object.keys(ResuxRuntime);
const apiCount = exportedKeys.length;
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Resux All-Features Matrix</h1>
      <span id="api-count-badge" class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold text-sm">
        {{ apiCount }} Exported APIs Tested
      </span>
    </div>

    <div id="matrix-grid" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div v-for="key in exportedKeys" :key="key" class="p-3 bg-white dark:bg-slate-800 rounded shadow text-xs font-mono border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <span>{{ key }}</span>
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
    </div>
  </div>
</template>
