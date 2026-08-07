<script setup lang="ts">
definePageMeta({ title: 'Forms and compiler directives' })
const name = useState('form-name', () => '')
const email = useState('form-email', () => '')
const plan = useState('form-plan', () => 'starter')
const agreed = useState('form-agreed', () => false)
const saved = useState('form-saved', () => false)
function saveForm() { saved.value = true }
function clearForm() { name.value = ''; email.value = ''; plan.value = 'starter'; agreed.value = false; saved.value = false }
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-2">
    <form class="panel p-8" @submit.prevent="saveForm">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">v-model lab</p>
      <h1 class="mt-4 text-3xl font-black text-white">Form state test</h1>
      <div class="mt-8 grid gap-4">
        <input class="input" placeholder="Name" v-model="name" />
        <input class="input" placeholder="Email" v-model="email" />
        <select class="input" v-model="plan">
          <option value="starter">Starter</option>
          <option value="scale">Scale</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <input type="checkbox" v-model="agreed" />
          I agree to test Resux form resume behavior.
        </label>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <button class="btn-primary" type="submit">Save state</button>
        <button class="btn-secondary" type="button" @click="clearForm">Clear</button>
      </div>
    </form>

    <div class="panel p-8">
      <p class="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Preview</p>
      <div class="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <p class="text-2xl font-black text-white">{{ name || 'Anonymous tester' }}</p>
        <p class="mt-2 text-slate-300">{{ email || 'No email yet' }}</p>
        <p class="mt-4 badge">Plan: {{ plan }}</p>
        <p class="mt-4 text-sm" :class="agreed ? 'text-emerald-300' : 'text-amber-300'">Agreement: {{ agreed ? 'yes' : 'no' }}</p>
        <p v-if="saved" class="mt-4 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-200">Saved in resumable state.</p>
      </div>
    </div>
  </section>
</template>
