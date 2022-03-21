// import md5 from 'blueimp-md5'
import { ref } from 'vue'
import { useActiveElement, useStorage } from '@vueuse/core'
import type { SubtitlesConfig } from '../types'

export const isFirstTime = ref(true)
export const isPlay = ref(false)
export const currentTTSLang = useStorage<string>('slidev-tts-lang', 'zh_CN')
export const currentTTSModel = useStorage<string>('slidev-tts-model', 'Male')
export const ccDisplay = useStorage<number>('slidev-cc-display', 1)
export const activeElement = useActiveElement()
// export const ccDisplay = ref(1)

export function audioSrc(config: SubtitlesConfig, word: string) {
  // const hash = `${lang}_${config.ttsModel[lang]}_${md5(`${encodeURI(word)}`)}.${config.ext}`
  // return `/${hash}`
  let apiCustom = ''
  for (const key in config.apiCustom)
    apiCustom += `&${key}=${config.apiCustom[key]}`
  const url = `${config.ttsApi}?format=${config.ext}&text=${word}&model=${currentTTSLang.value}_${currentTTSModel.value}${apiCustom}`
  return url
}
