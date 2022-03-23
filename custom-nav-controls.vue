<script setup lang="ts">
import VerticalDividerVue from '@slidev/client/internals/VerticalDivider.vue'
import SubtitleControls from './components/SubtitleControls.vue'
import LiveAvatarControls from './components/LiveAvatarControls.vue'
import { existAvatar } from './logic/liveAvatar'
import { existSubtitle } from './logic/subtitle'
</script>
<template>
  <VerticalDividerVue v-if="existAvatar" />
  <LiveAvatarControls v-if="existAvatar" />
  <VerticalDividerVue v-if="existSubtitle" />
  <SubtitleControls v-if="existSubtitle" />
</template>
