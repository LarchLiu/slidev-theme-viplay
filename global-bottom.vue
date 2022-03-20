<script setup lang="ts">
import { Subtitles } from './types'
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
const config = {
  noTTSDelay: 5000,
  ttsApi: 'http://localhost:3000/api/v1/tts',
  ttsLangName: {
    en: 'English(US)',
  },
}
const subtitles = new Subtitles(contents, config)
</script>
<template>
  <slides-subtitle :subtitles="subtitles" />
</template>
