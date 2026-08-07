<script setup>
import { useDevice, parseUserAgent } from "resuxjs";
import { ref, computed } from "vue";

const device = useDevice();
const customUa = ref("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15");

const parsedCustom = computed(() => parseUserAgent(customUa.value));
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Device Detection Test</h1>
    <div id="device-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow space-y-2">
        <h2 class="font-semibold text-lg">Current Device Flags</h2>
        <p id="dev-mobile">isMobile: {{ device.isMobile }}</p>
        <p id="dev-tablet">isTablet: {{ device.isTablet }}</p>
        <p id="dev-desktop">isDesktop: {{ device.isDesktop }}</p>
        <p id="dev-ios">isIos: {{ device.isIos }}</p>
        <p id="dev-android">isAndroid: {{ device.isAndroid }}</p>
      </div>
      <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow space-y-2">
        <h2 class="font-semibold text-lg">User-Agent Parser Test</h2>
        <input id="ua-input" v-model="customUa" class="w-full p-2 border rounded text-xs font-mono" />
        <p id="parsed-ios">Parsed isIos: {{ parsedCustom.isIos }}</p>
        <p id="parsed-mobile">Parsed isMobile: {{ parsedCustom.isMobile }}</p>
      </div>
    </div>
  </div>
</template>
