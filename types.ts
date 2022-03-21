export interface SubtitlesConfig {
  apiCustom?: Record<string, string>
  background?: string
  color?: string
  noTTSDelay?: number
  ext?: string
  fontSize?: string
  ttsApi?: string
  ttsLanguages?: string[]
  ttsLangName?: Record<string, string>
  ttsModel?: Record<string, string[]>
}
export interface ResolvedSubtitlesConfig {
  apiCustom: Record<string, string>
  audioPath: string
  background: string
  color: string
  noTTSDelay: number
  ext: string
  fontSize: string
  ttsApi: string
  ttsLanguages: string[]
  ttsLangName: Record<string, string>
  ttsModel: Record<string, string[]>
}
const defaultConfig = {
  apiCustom: {},
  audioPath: 'public',
  background: '#00000088',
  color: '#ffffff',
  noTTSDelay: 3000,
  ext: 'mp3',
  fontSize: '1em',
  ttsApi: '/api/tts',
  ttsLangName: { zh_CN: '中文', en: 'English' },
  ttsModel: { zh_CN: ['Male', 'Female'], en: ['Male', 'Female'] },
}
export class Subtitles {
  constructor(contents: Record<string, Record<string, Record<string, string[]>>>, config?: SubtitlesConfig) {
    const ttsLangName = { ...defaultConfig.ttsLangName, ...config?.ttsLangName }
    const ttsModel = { ...defaultConfig.ttsModel, ...config?.ttsModel }
    const _config = { ...defaultConfig, ...config, ttsLangName, ttsModel }
    const ttsLanguages = []

    for (const lang in contents)
      ttsLanguages.push(lang)

    this.config = config ? { ...defaultConfig, ..._config, ttsLanguages } : { ...defaultConfig, ttsLanguages }
    this.contents = contents
  }

  config: ResolvedSubtitlesConfig
  contents: Record<string, Record<string, Record<string, string[]>>>
}
