<script setup lang="ts">
import { useNav } from '@slidev/client'
import { Subtitles } from './types'

// import type { ServerReactive } from 'vite-plugin-vue-server-ref'
// import _serverVitarState from 'server-reactive:vitar'
// import type { ServerVitarState } from './types'
// const serverVitarState = _serverVitarState as ServerReactive<ServerVitarState>

interface FormatSubtitles {
  [langKey: string]: {
    [pageKey: string]: {
      [clickKey: string]: string[]
    }
  }
}
interface OriginalSubtitles {
  [clickKey: string]: {
    [langKey: string]: string[]
  }
}
const { slides } = useNav()
const contents: FormatSubtitles = {}
let config = {}
for (const slide of slides.value) {
  const frontmatter = (slide.meta.slide as any).frontmatter
  if (!frontmatter) {
    continue
  }
  if (frontmatter.subtitlesConfig) {
    config = {
      ...config,
      ...frontmatter.subtitlesConfig,
    }
  }
  if (frontmatter.subtitles) {
    // console.log(`subtitles: ${slide.no}`, (slide.meta.slide as any).frontmatter.subtitles)
    const subtitles: OriginalSubtitles = frontmatter.subtitles
    const pageKey = `page${slide.no}`
    const clickKeys = Object.keys(subtitles)
    const langKeys = Object.keys(subtitles[clickKeys[0]])
    for (const langKey of langKeys) {
      for (const clickKey of clickKeys) {
        if (subtitles[clickKey][langKey]) {
          if (!contents[langKey]) {
            contents[langKey] = {}
          }
          if (!contents[langKey][pageKey]) {
            contents[langKey][pageKey] = {}
          }
          if (!contents[langKey][pageKey][clickKey]) {
            contents[langKey][pageKey][clickKey] = []
          }
          contents[langKey][pageKey][clickKey] = [...subtitles[clickKey][langKey]]
        }
      }
    }
  }
}
const subtitles = new Subtitles(contents, config)
</script>

<template>
  <slides-subtitle :subtitles="subtitles" />
  <!-- <live-avatar :vitar-state="serverVitarState" /> -->
</template>
