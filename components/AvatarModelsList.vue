<script setup lang="ts">
import { computed } from 'vue'
import SelectList from '@slidev/client/internals/SelectList.vue'
import type { SelectionItem } from '@slidev/client/internals/types'
import { displayModel, modelType, models } from '../logic/liveAvatar'

const modelItems = computed<SelectionItem<string>[]>(() => [
  ...models.map(v => ({
    value: v,
    display: v,
  })),
])
const displayItems: SelectionItem<number>[] = [{ value: 1, display: 'True' }, { value: 0, display: 'False' }]
</script>

<template>
  <div class="text-sm">
    <SelectList v-model="modelType" title="Model" :items="modelItems" />
    <SelectList v-model="displayModel" title="Display" :items="displayItems" />
  </div>
</template>
