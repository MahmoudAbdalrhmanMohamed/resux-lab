<script setup lang="ts">
import { onMounted, ref } from 'vue'

const mediaSupported = ref(false)
const permissionsSupported = ref(false)
const cameraPermission = ref('not checked')
const cameraResult = ref('not requested')
const fileSummary = ref('no file selected')

onMounted(() => {
  mediaSupported.value = Boolean(navigator.mediaDevices?.getUserMedia)
  permissionsSupported.value = 'permissions' in navigator
})

async function checkCameraPermission() {
  if (!permissionsSupported.value) {
    cameraPermission.value = 'Permissions API unavailable'
    return
  }

  try {
    const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
    cameraPermission.value = status.state
  } catch {
    cameraPermission.value = 'camera permission query unsupported'
  }
}

async function requestCamera() {
  if (!mediaSupported.value) {
    cameraResult.value = 'getUserMedia unavailable'
    return
  }

  cameraResult.value = 'requesting'
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    const trackCount = stream.getTracks().length
    stream.getTracks().forEach(track => track.stop())
    cameraResult.value = `granted; ${trackCount} track(s) stopped after verification`
  } catch (error) {
    cameraResult.value = error instanceof Error ? `${error.name}: ${error.message}` : 'camera request failed'
  }
}

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    fileSummary.value = 'no file selected'
    return
  }

  fileSummary.value = `${file.name} / ${file.type || 'unknown type'} / ${file.size} bytes`
}
</script>

<template>
  <div class="space-y-6" data-testid="browser-capabilities">
    <section class="rounded-3xl border border-cyan-300/20 bg-cyan-500/10 p-6">
      <h2 class="text-2xl font-black text-white">Capability detection</h2>
      <dl class="mt-4 grid gap-2 text-slate-200 sm:grid-cols-2">
        <div><dt class="font-bold">getUserMedia</dt><dd>{{ mediaSupported ? 'supported' : 'unavailable' }}</dd></div>
        <div><dt class="font-bold">Permissions API</dt><dd>{{ permissionsSupported ? 'supported' : 'unavailable' }}</dd></div>
      </dl>
    </section>

    <section class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 class="text-2xl font-black text-white">Camera permission</h2>
      <p class="mt-2 text-slate-300">No permission prompt runs automatically.</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="rounded-xl bg-slate-200 px-4 py-2 font-bold text-slate-950" data-testid="check-camera-permission" @click="checkCameraPermission">
          Check permission state
        </button>
        <button class="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950" data-testid="request-camera" @click="requestCamera">
          Request and release camera
        </button>
      </div>
      <p class="mt-4" data-testid="camera-permission-result">Permission: {{ cameraPermission }}</p>
      <p class="mt-2" data-testid="camera-request-result">Camera: {{ cameraResult }}</p>
    </section>

    <section class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 class="text-2xl font-black text-white">Native file picker</h2>
      <p class="mt-2 text-slate-300">The file is inspected locally only; this demo does not upload it.</p>
      <label for="capability-file-picker" class="mt-4 block font-bold text-white">
        Select an image or PDF
      </label>
      <input
        id="capability-file-picker"
        class="mt-2 block w-full rounded-xl border border-white/20 bg-slate-950/50 p-3 text-white"
        data-testid="file-picker"
        type="file"
        accept="image/*,.pdf"
        @change="onFiles"
      >
      <p class="mt-3" data-testid="file-picker-result">{{ fileSummary }}</p>
    </section>
  </div>
</template>
