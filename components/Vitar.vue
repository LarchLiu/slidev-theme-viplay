<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'
import { getCurrentInstance, onMounted, ref, shallowRef, watch } from 'vue'

const isLive2dLoad = ref(false)
const isCubismLoad = ref(false)
const isFaceMeshLoad = ref(false)
const isCameraUtilsLoad = ref(false)
const isDrawingUtilsLoad = ref(false)
const Live2DLayer = shallowRef<any>()

const props = defineProps({
  modelOpt: {
    type: [Boolean, String],
    default: true,
  },
  mediaPipe: {
    type: Boolean,
    default: true,
  },
  showMesh: {
    type: Boolean,
    default: false,
  },
  showCam: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 9999,
  },
  displayOpt: {
    type: Object,
    default() {
      return {
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      }
    },
  },
})

const vm = getCurrentInstance()!

async function create() {
  if (props.mediaPipe || props.modelOpt)
    import('./Live2D.vue').then(v => Live2DLayer.value = v.default)
}

if (props.mediaPipe && (window as any).FaceMesh && (window as any).Camera && (window as any).drawConnectors && (window as any).Live2D && (window as any).Live2DCubismCore) {
  onMounted(create)
}
else {
  if (props.mediaPipe && (!(window as any).FaceMesh || !(window as any).Camera || !(window as any).drawConnectors)) {
    if (!(window as any).FaceMesh) {
      useScriptTag(
        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
        () => {
          isFaceMeshLoad.value = true
        },
        { async: true, crossOrigin: 'anonymous' },
      )
    }
    if (!(window as any).Camera) {
      useScriptTag(
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        () => {
          isCameraUtilsLoad.value = true
        },
        { async: true, crossOrigin: 'anonymous' },
      )
    }
    if (!(window as any).drawConnectors) {
      useScriptTag(
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
        () => {
          isDrawingUtilsLoad.value = true
        },
        { async: true, crossOrigin: 'anonymous' },
      )
    }
  }
  else {
    isFaceMeshLoad.value = true
    isCameraUtilsLoad.value = true
    isDrawingUtilsLoad.value = true
  }

  if (props.modelOpt && (!(window as any).Live2D || !(window as any).Live2DCubismCore)) {
    useScriptTag(
      'https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js',
      () => {
        isLive2dLoad.value = true
      },
      { async: true },
    )
    useScriptTag(
      'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
      () => {
        isCubismLoad.value = true
      },
      { async: true },
    )
  }
  else {
    isLive2dLoad.value = true
    isCubismLoad.value = true
  }

  if (isLive2dLoad.value && isCubismLoad.value && isFaceMeshLoad.value && isCameraUtilsLoad.value && isDrawingUtilsLoad.value && !Live2DLayer.value) {
    if (vm.isMounted)
      create()
    else
      onMounted(create, vm)
  }
}

watch([isLive2dLoad, isCubismLoad, isFaceMeshLoad, isCameraUtilsLoad, isDrawingUtilsLoad], () => {
  if (isLive2dLoad.value && isCubismLoad.value && isFaceMeshLoad.value && isCameraUtilsLoad.value && isDrawingUtilsLoad.value && !Live2DLayer.value) {
    if (vm.isMounted)
      create()
    else
      onMounted(create, vm)
  }
})
</script>

<template>
  <template v-if="Live2DLayer">
    <Live2DLayer
      :model="modelOpt" :media-pipe="mediaPipe" :show-cam="showCam"
      :show-mesh="showMesh" :z-index="zIndex" :display="displayOpt"
    />
  </template>
</template>
