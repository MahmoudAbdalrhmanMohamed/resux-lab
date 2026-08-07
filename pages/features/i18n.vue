<script setup>
import { ref } from "vue";

const currentLocale = ref("en");

function setLocale(loc) {
  currentLocale.value = loc;
}

const translations = {
  en: { welcome: "Welcome to Resux", greeting: "Hello {name}", nav: { home: "Home", about: "About" } },
  ar: { welcome: "مرحبا بكم في ريسوكس", greeting: "أهلا {name}", nav: { home: "الرئيسية", about: "حول" } }
};

function t(key, params = {}) {
  const locDict = translations[currentLocale.value] || translations.en;
  let text = key.split('.').reduce((acc, part) => acc && acc[part], locDict) || key;
  Object.keys(params).forEach(k => {
    text = text.replace(`{${k}}`, params[k]);
  });
  return text;
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">i18n Localization Test</h1>
    <div id="i18n-container" class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-4">
      <div class="flex space-x-3">
        <button id="lang-en" @click="setLocale('en')" class="px-3 py-1 rounded border" :class="currentLocale === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-100'">English</button>
        <button id="lang-ar" @click="setLocale('ar')" class="px-3 py-1 rounded border" :class="currentLocale === 'ar' ? 'bg-indigo-600 text-white' : 'bg-slate-100'">العربية</button>
      </div>
      <div class="space-y-2">
        <p id="t-welcome" class="text-xl font-semibold">{{ t('welcome') }}</p>
        <p id="t-greeting">{{ t('greeting', { name: 'Developer' }) }}</p>
        <p id="t-nav-home">Nav Home: {{ t('nav.home') }}</p>
      </div>
    </div>
  </div>
</template>
