import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const models = ['Haru', 'Hiyori', 'Mark', 'Natori', 'Rice']
export const modelType = useStorage('live-model-type', 'Hiyori')
export const displayModel = ref(0)
export const existAvatar = ref(false)
export const pluginRegisted = ref(false)
