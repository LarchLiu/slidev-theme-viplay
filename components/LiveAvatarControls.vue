<script setup lang="ts">
import MenuButton from '@slidev/client/internals/MenuButton.vue'
import { displayModel } from '../logic/liveAvatar'
import AvatarModelsListVue from './AvatarModelsList.vue'
</script>

<template>
  <MenuButton>
    <template #button>
      <button class="icon-btn" title="Live Avatar">
        <carbon-airline-passenger-care :style="{opacity: displayModel ? 1 : 0.4}" />
      </button>
    </template>
    <template #menu>
      <AvatarModelsListVue />
    </template>
  </MenuButton>
</template>
