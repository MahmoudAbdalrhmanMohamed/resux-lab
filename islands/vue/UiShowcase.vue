<script setup lang="ts">
import { ref } from 'vue'
import {
  RxAccordion,
  RxAlert,
  RxAutoAnimate,
  RxAvatar,
  RxBadge,
  RxButton,
  RxCard,
  RxDatePicker,
  RxDivider,
  RxDropdown,
  RxIcon,
  RxInput,
  RxKbd,
  RxModal,
  RxMotion,
  RxPopover,
  RxReveal,
  RxSelect,
  RxSkeleton,
  RxSwitch,
  RxTabs,
  RxTextarea,
  RxTooltip,
} from 'resuxjs/ui'

const name = ref('Resux')
const notes = ref('UI components are running inside a Vue island.')
const role = ref('editor')
const selectedDate = ref('2026-08-07')
const enabled = ref(true)
const selectedTab = ref('overview')
const modalOpen = ref(false)
const popoverOpen = ref(false)
const dropdownOpen = ref(false)
const list = ref(['Runtime', 'Compiler'])

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

const tabs = [
  { label: 'Overview', key: 'overview' },
  { label: 'Details', key: 'details' },
]

const menuItems = [
  { label: 'Add item', action: () => list.value.push(`Item ${list.value.length + 1}`) },
  { label: 'Reset', action: () => { list.value = ['Runtime', 'Compiler'] } },
]
</script>

<template>
  <div class="space-y-8" data-testid="ui-showcase">
    <RxAlert title="UI package active" variant="success">
      This page imports public primitives from <code>resuxjs/ui</code> inside a Vue island.
    </RxAlert>

    <RxCard class="space-y-5 p-6">
      <div class="flex flex-wrap items-center gap-3">
        <RxBadge variant="default">Forms</RxBadge>
        <RxAvatar alt="Resux test avatar" status="online" />
        <RxIcon name="check" />
      </div>

      <label class="block space-y-2">
        <span>Name</span>
        <RxInput v-model="name" data-testid="ui-input" placeholder="Name" />
      </label>

      <label class="block space-y-2">
        <span>Notes</span>
        <RxTextarea v-model="notes" data-testid="ui-textarea" :rows="4" />
      </label>

      <label class="block space-y-2">
        <span>Role</span>
        <RxSelect v-model="role" data-testid="ui-select" :options="roles" />
      </label>

      <label class="block space-y-2">
        <span>Date</span>
        <RxDatePicker v-model="selectedDate" data-testid="ui-date-picker" />
      </label>

      <div class="flex items-center gap-3">
        <RxSwitch v-model="enabled" data-testid="ui-switch" />
        <span>Enabled: {{ enabled }}</span>
      </div>

      <p data-testid="ui-model-summary">
        {{ name }} / {{ role }} / {{ selectedDate }}
      </p>
    </RxCard>

    <RxCard class="space-y-5 p-6">
      <RxDivider label="Navigation and overlays" />
      <RxTabs v-model="selectedTab" :items="tabs" data-testid="ui-tabs" />
      <p>Selected tab: {{ selectedTab }}</p>

      <RxAccordion title="Accordion test" :open="true">
        Accordion body remains readable inside the island.
      </RxAccordion>

      <div class="flex flex-wrap gap-4">
        <RxPopover v-model:open="popoverOpen">
          <template #trigger>
            <RxButton variant="secondary">Popover</RxButton>
          </template>
          <p class="p-3">Popover content</p>
        </RxPopover>

        <RxDropdown v-model:open="dropdownOpen" :items="menuItems">
          <template #trigger>
            <RxButton variant="secondary">Dropdown</RxButton>
          </template>
        </RxDropdown>

        <RxTooltip text="Tooltip content">
          <RxButton variant="secondary">Tooltip target</RxButton>
        </RxTooltip>

        <RxButton data-testid="ui-open-modal" @click="modalOpen = true">Open modal</RxButton>
      </div>

      <RxModal v-model:open="modalOpen" title="Resux UI modal" data-testid="ui-modal">
        <p>Modal content is mounted only while open.</p>
      </RxModal>
    </RxCard>

    <RxCard class="space-y-5 p-6">
      <RxDivider label="Motion and feedback" />
      <RxMotion preset="fade-up" :duration="180">
        <p>RxMotion content</p>
      </RxMotion>
      <RxReveal preset="fade-up" :duration="180">
        <p>RxReveal content</p>
      </RxReveal>
      <RxAutoAnimate :duration="180">
        <ul class="space-y-2">
          <li v-for="item in list" :key="item">{{ item }}</li>
        </ul>
      </RxAutoAnimate>
      <div class="flex items-center gap-3">
        <RxSkeleton width="5rem" height="1rem" />
        <span>Keyboard: <RxKbd>Ctrl</RxKbd> + <RxKbd>K</RxKbd></span>
      </div>
    </RxCard>
  </div>
</template>
