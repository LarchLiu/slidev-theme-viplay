<script setup lang="ts">
import MenuButton from '@slidev/client/internals/MenuButton.vue'
import { ccDisplay, isPlay, subtitlesConfig } from '../logic/subtitle'
import LanguageList from './LanguageList.vue'
</script>

<template>
  <MenuButton>
    <template #button>
      <button class="icon-btn" title="Subtitles">
        <ic-outline-subtitles v-if="ccDisplay" />
        <ic-outline-subtitles-off v-else />
      </button>
    </template>
    <template #menu>
      <LanguageList :config="subtitlesConfig!" />
    </template>
  </MenuButton>
  <button
    class="icon-btn"
    :title="isPlay ? 'Pause' : 'Play'"
    @click="isPlay = !isPlay"
  >
    <carbon-pause v-if="isPlay" />
    <carbon-play v-else />
  </button>
</template>
