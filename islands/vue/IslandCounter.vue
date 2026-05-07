<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ start: number }>()
const count = ref(props.start)
</script>
<template>
  <div class="rounded-3xl border border-purple-300/30 bg-purple-500/10 p-6 text-white">
    <p class="text-sm uppercase tracking-[0.25em] text-purple-200">Vue Island</p>
    <p class="mt-4 text-3xl font-black">{{ count }}</p>
    <button class="mt-5 rounded-2xl bg-purple-200 px-4 py-2 font-bold text-slate-950" @click="count++">Vue increment</button>
  </div>
</template>
