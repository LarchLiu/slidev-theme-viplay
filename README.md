# slidev-theme-viplay

[![NPM version](https://img.shields.io/npm/v/slidev-theme-viplay?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-theme-viplay)

Some components for [Slidev](https://github.com/slidevjs/slidev).

## Installation

```bash
npm i slidev-theme-viplay --save
```

or

```bash
yarn add slidev-theme-viplay
```

or

```bash
pnpm i slidev-theme-viplay
```

## Components

This theme provides the following components:

- **SlidesSubtitle** - provide subtitle and tts for slides, you can custom languages and tts models.

## Usage

### SlidesSubtitle

Create a `./global-top.vue` file in your `Slidev` project and use the component:

```vue
<script setup lang="ts">
import { Subtitles } from 'slidev-theme-viplay/types'

const contents = {
  zh_CN: {
    page1: {
      click0: [
        '大家好，欢迎来到Slidev',
        '今天讲一下Slidev的特点和用法',
        '让我们开始吧/D/1000',
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
```

## Contributing

- `npm install`
- `npm run dev` to start theme preview of `example.md`
- Edit the `global-bottom.vue` to see the changes
- `npm run export` to generate the preview PDF
- `npm run screenshot` to generate the preview PNG
