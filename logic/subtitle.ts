// import md5 from 'blueimp-md5'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { ResolvedSubtitlesConfig } from 'types'

export const isFirstTime = ref(true)
export const isPlay = ref(false)
export const currentTTSLang = useStorage<string>('slidev-tts-lang', 'zh_CN')
export const currentTTSModel = useStorage<string>('slidev-tts-model', 'Male')
export const ccDisplay = useStorage<number>('slidev-cc-display', 1)
export const subtitlesConfig = ref<ResolvedSubtitlesConfig | undefined>()
export const existSubtitle = ref(false)
// export const ccDisplay = ref(1)

export function audioSrc(word: string) {
  // const hash = `${lang}_${config.ttsModel[lang]}_${md5(`${encodeURI(word)}`)}.${config.ext}`
  // return `/${hash}`
  const config = subtitlesConfig.value!
  let apiCustom = ''
  for (const key in config.apiCustom)
    apiCustom += `&${key}=${config.apiCustom[key]}`
  const url = `${config.ttsApi}?format=${config.ext}&text=${word}&model=${currentTTSLang.value}_${currentTTSModel.value}${apiCustom}`
  return url
}
