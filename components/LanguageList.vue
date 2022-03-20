<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SelectList from '@slidev/client/internals/SelectList.vue'
import type { SelectionItem } from '@slidev/client/internals/types'
import { ccDisplay, currentTTSLang, currentTTSModel } from '../logic/subtitle'
import type { ResolvedSubtitlesConfig } from '../types'

const props = defineProps<{ config: ResolvedSubtitlesConfig }>()
const getLangName = (str: string) => {
  return props.config.ttsLangName[str] || str
}

const languagesItems = computed<SelectionItem<string>[]>(() => [
  ...props.config.ttsLanguages.map(v => ({
    value: v,
    display: getLangName(v),
  })),
])
const modelItems = computed<SelectionItem<string>[]>(() => [
  ...props.config.ttsModel[currentTTSLang.value].map(v => ({
    value: v,
    display: v,
  })),
])
const ccDisplayItems: SelectionItem<number>[] = [{ value: 1, display: 'True' }, { value: 0, display: 'False' }]
onMounted(() => {
  if (!props.config.ttsLanguages.find(i => i === currentTTSLang.value)) {
    if (props.config.ttsLanguages[0])
      currentTTSLang.value = props.config.ttsLanguages[0]
  }
})
</script>

<template>
  <div class="text-sm">
    <SelectList v-model="currentTTSLang" title="Language" :items="languagesItems" />
    <SelectList v-model="currentTTSModel" title="Model" :items="modelItems" />
    <SelectList v-model="ccDisplay" title="Display" :items="ccDisplayItems" />
  </div>
</template>
