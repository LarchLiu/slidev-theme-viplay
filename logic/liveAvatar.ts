import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import _serverVitarState from 'server-reactive:vitar?diff'
import type { ServerReactive } from 'vite-plugin-vue-server-ref'

interface ServerVitarState {
  sync: boolean
  data: any
}

export const serverVitarState = _serverVitarState as ServerReactive<ServerVitarState>
export const models = ['Haru', 'Hiyori', 'Mark', 'Natori', 'Rice']
export const modelType = useStorage('live-model-type', 'Hiyori')
export const displayModel = ref(0)
export const existAvatar = ref(false)
export const pluginRegisted = ref(false)
