<script setup lang="ts">
const props = defineProps<{ title: string; label: string; status: string }>()
</script>

<template>
  <article class="panel p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{{ props.label }}</p>
        <h3 class="mt-2 text-xl font-bold text-white">{{ props.title }}</h3>
      </div>
      <span class="badge">{{ props.status }}</span>
    </div>
    <slot />
  </article>
</template>
