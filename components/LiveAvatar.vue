<script setup lang="ts">
import type { ServerVitarState } from 'types'
import type { ServerReactive } from 'vite-plugin-vue-server-ref'
import { useNav } from '@slidev/client'
import { onMounted, provide, reactive, ref, watch } from 'vue'
import { displayModel, existAvatar, modelType } from '../logic/liveAvatar'
import Vitar from './Vitar.vue'

const props = defineProps<{ vitarState: ServerReactive<ServerVitarState> }>()

const isDev = import.meta.env.MODE === 'development'

provide('vitarState', props.vitarState)

const { isPresenter } = useNav()
const modelUrl = ref('')
const displayOpt = reactive({
  scale: 2,
  offsetX: 0,
  offsetY: 0,
})
function setModel(name: string) {
  modelUrl.value = `https://raw.githubusercontent.com/Live2D/CubismWebSamples/develop/Samples/Resources/${name}/${name}.model3.json`
  if (name === 'Rice') {
    displayOpt.scale = 2.1
    displayOpt.offsetX = -20
    displayOpt.offsetY = 2
  }
  else if (name === 'Mark') {
    displayOpt.scale = 1.5
    displayOpt.offsetX = 0
    displayOpt.offsetY = 6
  }
  else if (name === 'Natori') {
    displayOpt.scale = 2.5
    displayOpt.offsetX = 0
    displayOpt.offsetY = 2
  }
  else {
    displayOpt.scale = 2
    displayOpt.offsetX = 0
    displayOpt.offsetY = 0
  }
}
watch(() => props.vitarState, (v) => {
  if (v.sync && !displayModel.value)
    displayModel.value = 1
})
watch(displayModel, (b) => {
  if (b)
    setModel(modelType.value)
})
watch(modelType, () => {
  setModel(modelType.value)
})
onMounted(() => {
  if (isDev)
    existAvatar.value = true
  if (props.vitarState.sync)
    displayModel.value = 1
})
</script>

<template>
  <div v-if="isDev && displayModel">
    <Vitar :model-opt="modelUrl" :media-pipe="isPresenter" :display-opt="displayOpt" />
  </div>
</template>
