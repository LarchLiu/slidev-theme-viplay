<script setup lang="ts">
import type { SelectionItem } from '@slidev/client/internals/types'
import type { ResolvedSubtitlesConfig } from '../types'
import SelectList from '@slidev/client/internals/SelectList.vue'
import { computed, watch } from 'vue'
import { ccDisplay, currentTTSLang, currentTTSModel } from '../logic/subtitle'

const props = defineProps<{ config: ResolvedSubtitlesConfig }>()
function getLangName(str: string) {
  return props.config.ttsLangName[str] || str
}

if (!props.config.ttsLanguages.find(i => i === currentTTSLang.value)) {
  if (props.config.ttsLanguages[0])
    currentTTSLang.value = props.config.ttsLanguages[0]
}

const languagesItems = computed<SelectionItem<string>[]>(() => [
  ...props.config.ttsLanguages.map(v => ({
    value: v,
    display: getLangName(v),
  })),
])
const modelItems = computed<SelectionItem<string>[]>(() => [
  ...props.config.ttsModel[currentTTSLang.value].map(v => ({
    value: v.value,
    display: v.display,
  })),
])
currentTTSModel.value = modelItems.value[0].value

const ccDisplayItems: SelectionItem<number>[] = [{ value: 1, display: 'True' }, { value: 0, display: 'False' }]

watch(currentTTSLang, (lang) => {
  if (props.config.ttsModel[lang])
    currentTTSModel.value = props.config.ttsModel[lang][0].value
})
</script>

<template>
  <div class="text-sm">
    <SelectList v-model="currentTTSLang" title="Language" :items="languagesItems" />
    <SelectList v-model="currentTTSModel" title="Model" :items="modelItems" />
    <SelectList v-model="ccDisplay" title="Display" :items="ccDisplayItems" />
  </div>
</template>
