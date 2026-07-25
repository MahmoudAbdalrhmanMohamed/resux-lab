<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  toRef,
  toRefs,
  unref,
  isRef,
  isReactive,
  isReadonly
} from "vue";

const count = ref(0);
const state = reactive({ name: "Resux", level: 1 });
const doubleCount = computed(() => count.value * 2);
const logs = ref([]);

const sharedState = useState("shared-key", () => "Persistent Resux State");

watch(count, (newVal) => {
  logs.value.push(`watch count: ${newVal}`);
});

watchEffect(() => {
  logs.value.push(`watchEffect level: ${state.level}`);
});

function increment() {
  count.value++;
  state.level++;
}

const isCountRef = isRef(count);
const isStateReactive = isReactive(state);
const isCountReadonly = isReadonly(count);
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Reactivity & State Test</h1>
    <div id="reactivity-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow space-y-2">
        <h2 class="font-semibold text-lg">Counters & Computed</h2>
        <p id="count-val">Count: {{ count }}</p>
        <p id="double-val">Double: {{ doubleCount }}</p>
        <p id="state-val">State Level: {{ state.level }}</p>
        <button id="inc-btn" @click="increment" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Increment</button>
      </div>
      <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow space-y-2">
        <h2 class="font-semibold text-lg">Reactivity Checks</h2>
        <p id="is-ref-val">isRef(count): {{ isCountRef }}</p>
        <p id="is-reactive-val">isReactive(state): {{ isStateReactive }}</p>
        <p id="is-readonly-val">isReadonly(count): {{ isCountReadonly }}</p>
        <p id="shared-state-val">useState: {{ sharedState }}</p>
      </div>
    </div>
    <div class="p-4 bg-slate-900 text-slate-100 rounded-lg">
      <h3 class="font-mono text-sm text-slate-400">Watch Logs</h3>
      <div id="watch-logs" class="font-mono text-xs mt-2 space-y-1">
        <div v-for="(log, idx) in logs" :key="idx">{{ log }}</div>
      </div>
    </div>
  </div>
</template>
