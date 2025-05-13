export interface SubtitlesConfig {
  apiCustom?: Record<string, string>
  background?: string
  color?: string
  noTTSDelay?: number
  ext?: string
  fontSize?: string
  ttsApi?: string
  ttsLangName?: Record<string, string>
  ttsModel?: Record<string, TTSModel[]>
}
export interface TTSModel {
  value: string
  display: string
}
export interface ResolvedSubtitlesConfig {
  apiCustom: Record<string, string>
  background: string
  color: string
  noTTSDelay: number
  ext: string
  fontSize: string
  ttsApi: string
  ttsLanguages: string[]
  ttsLangName: Record<string, string>
  ttsModel: Record<string, TTSModel[]>
}
const defaultConfig = {
  apiCustom: {},
  background: '#00000088',
  color: '#ffffff',
  noTTSDelay: 3000,
  ext: 'mp3',
  fontSize: '1em',
  ttsApi: '/api/tts',
  ttsLangName: {
    zh_CN: 'Chinese',
    en: 'English',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    kr: 'Korean',
    nl: 'Dutch',
    it: 'Italian',
    ja: 'Japanese',
    pt: 'Portuguese',
    ru: 'Russian',
  },
  ttsModel: { zh_CN: [{ value: 'zh_CN_Male', display: 'Male' }, { value: 'zh_CN_Female', display: 'Female' }], en: [{ value: 'en_Male', display: 'Male' }, { value: 'en_Female', display: 'Female' }] },
}
export class Subtitles {
  constructor(contents: Record<string, Record<string, Record<string, string[]>>>, config?: SubtitlesConfig) {
    const ttsLangName = { ...defaultConfig.ttsLangName, ...config?.ttsLangName } as Record<string, string>
    const ttsModel = { ...defaultConfig.ttsModel, ...config?.ttsModel }
    const _config = { ...defaultConfig, ...config, ttsLangName, ttsModel }
    const ttsLanguages = []

    for (const lang in contents)
      ttsLanguages.push(lang)

    for (const lang in ttsLanguages) {
      if (!ttsLangName[lang])
        ttsLangName[lang] = lang
    }

    this.config = config ? { ...defaultConfig, ..._config, ttsLanguages } : { ...defaultConfig, ttsLanguages }
    this.contents = contents
  }

  config: ResolvedSubtitlesConfig
  contents: Record<string, Record<string, Record<string, string[]>>>
}

export interface ServerVitarState {
  sync: boolean
  data: any
}
