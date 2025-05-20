import type { ResolvedSubtitlesConfig } from 'types'
import { useStorage } from '@vueuse/core'
// import md5 from 'blueimp-md5'
import { ref } from 'vue'

export const isFirstTime = ref(true)
export const isPlay = ref(false)
export const currentTTSLang = useStorage<string>('slidev-tts-lang', 'en')
export const currentTTSModel = useStorage<string>('slidev-tts-model', 'en_Male')
export const ccDisplay = useStorage<number>('slidev-cc-display', 1)
export const subtitlesConfig = ref<ResolvedSubtitlesConfig | undefined>()
export const existSubtitle = ref(false)
// export const ccDisplay = ref(1)

export function audioSrc(word: string) {
  // const hash = `${lang}_${config.ttsModel[lang]}_${md5(`${encodeURI(word)}`)}.${config.ext}`
  // return `/${hash}`
  const config = subtitlesConfig.value!
  let url = `${config.ttsApi}?`
  const commonKeys: any = {
    input: encodeURIComponent(word),
    model: currentTTSModel.value,
    format: config.ext,
  }
  const otherKeys: any = {}

  for (const key in config.apiCustom) {
    if (key === 'input')
      commonKeys[config.apiCustom[key]] = encodeURIComponent(word)
    else if (key === 'model')
      commonKeys[config.apiCustom[key]] = currentTTSModel.value
    else if (key === 'format')
      commonKeys[config.apiCustom[key]] = config.ext
    else
      otherKeys[key] = config.apiCustom[key]
  }
  for (const key in commonKeys) {
    url += `${key}=${commonKeys[key]}&`
  }
  for (const key in otherKeys) {
    url += `${key}=${otherKeys[key]}&`
  }
  // url = `${config.ttsApi}?format=${config.ext}&input=${word}&model=${currentTTSModel.value}${apiCustom}`
  return url
}
