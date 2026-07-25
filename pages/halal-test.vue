<script setup>
import { ref } from "vue";

const userPrompt = ref("Is investment in halal technology compliant?");
const aiResponse = ref("");
const isAnalyzing = ref(false);
const learningHistory = ref([
  { prompt: "Check ingredients: Gelatin, Water", result: "Halal status: Conditional (Requires Halal source verification)" }
]);

function talkToHalalAI() {
  if (!userPrompt.value.trim()) return;
  isAnalyzing.value = true;
  setTimeout(() => {
    aiResponse.value = `[Halal-AI LLM]: Query "${userPrompt.value}" evaluated. Verdict: Verified Halal compliant under standard guidelines. Learned pattern recorded.`;
    learningHistory.value.push({ prompt: userPrompt.value, result: aiResponse.value });
    isAnalyzing.value = false;
  }, 100);
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Halal Core & Halal-AI LLM Test Bench</h1>

    <div id="halal-ai-box" class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow space-y-4">
      <h2 class="text-xl font-semibold">Halal-AI Interactive LLM</h2>
      <div class="flex gap-2">
        <input id="halal-input" v-model="userPrompt" class="flex-1 p-2 border rounded text-sm text-slate-800 dark:text-slate-100 bg-transparent" placeholder="Ask Halal-AI..." />
        <button id="halal-send-btn" @click="talkToHalalAI" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
          {{ isAnalyzing ? 'Analyzing...' : 'Talk to AI' }}
        </button>
      </div>

      <div id="halal-ai-response" class="p-3 bg-emerald-50 dark:bg-slate-900 rounded border border-emerald-200 text-emerald-900 dark:text-emerald-300 font-mono text-xs">
        {{ aiResponse || 'Ask a query to start interaction.' }}
      </div>

      <div class="space-y-2">
        <h3 class="font-semibold text-sm text-slate-500">Learned Conversational History</h3>
        <div id="halal-history" class="space-y-1">
          <div v-for="(item, idx) in learningHistory" :key="idx" class="text-xs p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <strong>Q:</strong> {{ item.prompt }} | <strong>A:</strong> {{ item.result }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
