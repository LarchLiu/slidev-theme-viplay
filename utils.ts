import { createWriteStream, ensureDir, existsSync, unlink } from 'fs-extra'
// import { dirname, resolve } from 'path'
import axios from 'axios'
import md5 from 'blueimp-md5'
// import { slash } from '@antfu/utils'
import type { ResolvedSubtitlesConfig, Subtitles } from './types'

export async function downloadTo(text: string, filepath: string, options: ResolvedSubtitlesConfig, lang: string): Promise<void> {
  const writer = createWriteStream(filepath)
  let ttsCustom = ''

  for (const key in options.apiCustom)
    ttsCustom += `&${key}=${options.apiCustom[key]}`

  const response = await axios({
    url: `${options.ttsApi}?format=${options.ext}&text=${text}&model=${lang}_${options.ttsModel[lang]}${ttsCustom}`,
    method: 'GET',
    responseType: 'stream',
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export async function downloadTTS(subtitles: Subtitles) {
  const contents = subtitles.contents
  const config = subtitles.config
  const tasksMap: Record<string, Promise<void> | undefined> = {}
  const tasks: Promise<void>[] = []
  const dir = (`/${config.audioPath}`)
  await ensureDir(dir)
  // const subtitles = []
  for (const lang in contents) {
    const pages = contents[lang]
    for (const page in pages) {
      const subtitles = contents[lang][page]
      for (const key in subtitles) {
        const texts = subtitles[key]
        for (const title of texts) {
          const arr = title.split('/D/')
          const text = encodeURI(arr[0].trim())
          if (text) {
            const hash = `${lang}_${config.ttsModel[lang]}_${md5(encodeURI(arr[0].trim()))}.${config.ext}`
            const filepath = ((dir + hash))

            if (!existsSync(filepath) || tasksMap[filepath]) {
              if (!tasksMap[filepath]) {
                tasksMap[filepath] = (async() => {
                  try {
                    await downloadTo(text, filepath, config, lang)
                  }
                  catch (e) {
                    if (existsSync(filepath))
                      await unlink(filepath)

                    if (axios.isAxiosError(e)) {
                    // eslint-disable-next-line no-console
                      console.log(`${(`Download audio fail - ${e.message}`)}`)
                    }
                    else {
                      // eslint-disable-next-line no-console
                      console.log(`  ${('Download audio fail')}`)
                    }
                    throw e
                  }
                  finally {
                    delete tasksMap[filepath]
                  }
                })()
              }
              tasks.push(tasksMap[filepath]!)
            }
          }
        }
      }
    }
  }

  await Promise.all(tasks)
}
