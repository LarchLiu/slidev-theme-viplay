<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { clicks, currentPage, go, hasNext, next } from '@slidev/client/logic/nav'
import type { Subtitles } from '../types'
import { audioSrc, ccDisplay, currentTTSLang, currentTTSModel, existSubtitle, isFirstTime, isPlay, subtitlesConfig } from '../logic/subtitle'
// import { downloadTTS } from '../utils'

const props = defineProps<{ subtitles: Subtitles }>()
const contents = ref(props.subtitles.contents)
const config = ref(props.subtitles.config)
const {
  background,
  color,
  noTTSDelay,
  fontSize,
} = config.value

const subtitleIdx = ref(-1)
const subtitleCount = ref(0)
const subtitleDisplay = ref(false)
const curSubtitle = ref('')
const delay = ref(0)
const audio = ref()
const language = computed(() => currentTTSLang.value)
const page = computed(() => `page${currentPage.value}`)
const click = computed(() => `click${clicks.value}`)
let timer = 0

const parseSubtitle = () => {
  const arr = contents.value[language.value][page.value][click.value][subtitleIdx.value].split('/D/')
  curSubtitle.value = arr[0].trim()
  if (arr[1])
    delay.value = parseInt(arr[1])
  else
    delay.value = 1000
}

const createTimer = () => {
  timer = window.setTimeout(() => {
    if (!hasNext.value) {
      isPlay.value = false
      go(1)
    }
    else { next() }
  }, noTTSDelay)
}

const initSubtitle = () => {
  subtitleIdx.value = -1
  if (timer)
    clearTimeout(timer)
  if (contents.value
    && contents.value[language.value][page.value]
    && contents.value[language.value][page.value][click.value]
  ) {
    subtitleCount.value = contents.value[language.value][page.value][click.value].length
    if (subtitleCount.value > 0) {
      subtitleIdx.value = 0
      parseSubtitle()
      return
    }
  }
  if (isPlay.value)
    createTimer()
}

const resetSubtitle = () => {
  if (timer)
    clearTimeout(timer)
  if (contents.value
    && contents.value[language.value][page.value]
    && contents.value[language.value][page.value][click.value]
  ) {
    subtitleCount.value = contents.value[language.value][page.value][click.value].length
    if (subtitleCount.value > 0) {
      if (subtitleIdx.value < 0)
        subtitleIdx.value = 0
      if (contents.value[language.value][page.value][click.value][subtitleIdx.value]) {
        parseSubtitle()
        return
      }
    }
  }
  if (isPlay.value)
    createTimer()
}

const onAudioEnded = () => {
  subtitleDisplay.value = false
  if (isFirstTime.value)
    isFirstTime.value = false
  timer = window.setTimeout(() => {
    if (subtitleIdx.value + 1 >= subtitleCount.value) {
      if (!hasNext.value)
        isPlay.value = false
      else
        next()
    }
    else {
      subtitleIdx.value++
      parseSubtitle()
    }
  }, delay.value)
}

const play = () => {
  if (audio.value) {
    if (curSubtitle.value) {
      audio.value.src = audioSrc(curSubtitle.value)
      subtitleDisplay.value = true
      audio.value.play()
    }
    else {
      onAudioEnded()
    }
  }
  else {
    createTimer()
  }
}

const pause = () => {
  if (audio.value)
    audio.value.pause()

  if (timer)
    clearTimeout(timer)
}

watch([clicks, currentPage], () => {
  initSubtitle()
})
watch([curSubtitle, subtitleIdx], () => {
  if (!isFirstTime.value && isPlay.value && subtitleIdx.value !== -1)
    play()
})
watch(isPlay, () => {
  if (isPlay.value)
    play()
  else
    pause()
})
watch([currentTTSLang, currentTTSModel], () => {
  if (isPlay.value)
    isPlay.value = false
  resetSubtitle()
})
onMounted(async() => {
  // await downloadTTS(props.subtitles)
  existSubtitle.value = true
  subtitlesConfig.value = config.value
  initSubtitle()
})
</script>

<template>
  <div class="abs-b text-center">
    <div v-if="contents && contents[language] && contents[language][page] && contents[language][page][click]">
      <span v-if="subtitleDisplay && ccDisplay && curSubtitle" class="px-2" :style="{background, color, fontSize}">{{ curSubtitle }}</span>
      <audio ref="audio" @ended="onAudioEnded" />
    </div>
  </div>
</template>
