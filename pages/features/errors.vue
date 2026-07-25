<script setup>
import { useError, createError } from "resuxjs";
import { ref } from "vue";

const activeError = useError();
const localErrorMsg = ref("");

function triggerLocalError() {
  const err = createError({ statusCode: 400, message: "Invalid request parameters" });
  localErrorMsg.value = `${err.name} [${err.statusCode}]: ${err.message}`;
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Error Handling & Recovery Test</h1>
    <div id="error-container" class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-4">
      <div class="flex space-x-3">
        <button id="trigger-btn" @click="triggerLocalError" class="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700">Create Error</button>
      </div>
      <div class="space-y-2">
        <p id="local-err-val" class="font-mono text-sm text-rose-500">{{ localErrorMsg }}</p>
        <p id="global-err-val">Active Error: {{ activeError ? activeError.message : 'None' }}</p>
      </div>
    </div>
  </div>
</template>
