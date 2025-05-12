<script setup lang="ts">
import { useNav } from '@slidev/client'
// import type { ServerReactive } from 'vite-plugin-vue-server-ref'
// import _serverVitarState from 'server-reactive:vitar'
// import type { ServerVitarState } from './types'
import { Subtitles } from './types'

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
const _contents: FormatSubtitles = {}
for (const slide of slides.value) {
  // console.log('slide:', slide)
  if ((slide.meta.slide as any).frontmatter.subtitles) {
    // console.log(`subtitles: ${slide.no}`, (slide.meta.slide as any).frontmatter.subtitles)
    const subtitles: OriginalSubtitles = (slide.meta.slide as any).frontmatter.subtitles
    const pageKey = `page${slide.no}`
    const clickKeys = Object.keys(subtitles)
    const langKeys = Object.keys(subtitles[clickKeys[0]])
    for (const langKey of langKeys) {
      for (const clickKey of clickKeys) {
        if (subtitles[clickKey][langKey]) {
          if (!_contents[langKey]) {
            _contents[langKey] = {}
          }
          if (!_contents[langKey][pageKey]) {
            _contents[langKey][pageKey] = {}
          }
          if (!_contents[langKey][pageKey][clickKey]) {
            _contents[langKey][pageKey][clickKey] = []
          }
          _contents[langKey][pageKey][clickKey] = [...subtitles[clickKey][langKey]]
        }
      }
    }
  }
}
const contents = {
  zh_CN: {
    page1: {
      click0: [
        '大家好，欢迎来到Slidev',
        '今天讲一下Slidev的特点和用法',
        '让我们开始吧/D/1000',
      ],
    },
    page2: {
      click0: [
        '/D/1000',
        '那什么是Slidev呢?/D/1500',
        'Slidev是一个为开发者设计的幻灯片制作和演示器，包括以下功能',
        '用Markdown专注于内容，然后再对它们进行样式设计',
        '主题可以与npm包共享和使用',
        '代码高亮，带自动完成的实时编码',
        '嵌入Vue组件以增强你的表达能力',
        '网页上的一切可能',
      ],
    },
    page3: {
      click0: [
        '下面我们讲一下导航的设置',
        '系统提供了快捷键设置，如表所示可以快速切换页面或动画',
      ],
      click1: [
        '导航栏的控制面板位于页面的左下角',
        '当鼠标移动到该区域即可显示',
      ],
    },
  },
  en: {
    page1: {
      click0: [
        'Hello everyone, welcome to Slidev!',
        'Now i will talk about the features and usage of Slidev.',
        'Let\'s get started./D/1000',
      ],
    },
    page2: {
      click0: [
        '/D/1000',
        'What is Slidev?/D/1500',
        'Slidev is a slides maker and presenter designed for developers, consist of the following features',
        'Focus on the content with Markdown, and then style them later',
        'Theme can be shared and used with npm packages',
        'Code highlighting, live coding with autocompletion',
        'Embedding Vue components to enhance your expressions',
        'Anything possible on a webpage',
      ],
    },
    page3: {
      click0: [
        'Let\'s talk about the navigation',
        'Slidev provides shortcut key settings, as shown in the table to quickly switch between pages or animations',
      ],
      click1: [
        'The control panel of the navigation is located in the bottom left corner of the page',
        'Hover on the area to display',
      ],
    },
  },
}
const fullContents = JSON.parse(JSON.stringify(contents))
for (const langKey in _contents) {
  if (!fullContents[langKey]) {
    fullContents[langKey] = {}
  }
  for (const pageKey in _contents[langKey]) {
    if (!fullContents[langKey][pageKey]) {
      fullContents[langKey][pageKey] = {}
    }
    for (const clickKey in _contents[langKey][pageKey]) {
      if (!fullContents[langKey][pageKey][clickKey]) {
        fullContents[langKey][pageKey][clickKey] = []
      }
      // Merge arrays while preserving order
      fullContents[langKey][pageKey][clickKey] = [
        ...fullContents[langKey][pageKey][clickKey],
        ..._contents[langKey][pageKey][clickKey],
      ]
    }
  }
}
const config = {
  noTTSDelay: 2000,
  ttsApi: 'http://openai.fm/api/generate',
  ttsLangName: {
    en: 'English(US)',
  },
  apiCustom: {
    model: 'voice',
    prompt: 'You are a slide presenter, please read the text in a clear manner',
  },
  ttsModel: {
    zh_CN: [{ value: 'onyx', display: 'Onyx' }, { value: 'sage', display: 'Sage' }],
    en: [{ value: 'ash', display: 'Ash' }, { value: 'nova', display: 'Nova' }],
  },
}
const subtitles = new Subtitles(fullContents, config)
</script>

<template>
  <slides-subtitle :subtitles="subtitles" />
  <!-- <live-avatar :vitar-state="serverVitarState" /> -->
</template>
