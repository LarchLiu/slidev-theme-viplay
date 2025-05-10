<script setup lang="ts">
import { slideHeight, slideWidth, useNav, useSlideContext } from '@slidev/client'
import { Live2DModel } from 'pixi-live2d-display'
// import { Application } from '@pixi/app'
// import { Ticker, TickerPlugin } from '@pixi/ticker'
import type { TFace } from 'kalidokit'
import { Face, Vector } from 'kalidokit'
import { useDraggable, useStorage } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { pluginRegisted, serverVitarState } from '../logic/liveAvatar'

const { Application } = (window as any).PIXI
// const scale = inject(injectionSlideScale)!

const props = defineProps({
  model: [Boolean, String],
  mediaPipe: Boolean,
  showMesh: Boolean,
  showCam: Boolean,
  zIndex: Number,
  display: Object,
})

const { lerp } = Vector
const { isPresenter } = useNav()
const { $scale: scale } = useSlideContext()

let mpCamera: any
let mpDrawing: any
let mpFaceMesh: any
let faceMesh: any
let camera: any

const minSize = 80
const size = useStorage('live-model-size', Math.round(Math.max(minSize, (slideWidth.value) / 8)))
const position = ref({
  x: (slideWidth.value - size.value - 20) * scale.value,
  y: (slideHeight.value - size.value - 20) * scale.value,
})
const container = ref<HTMLDivElement | undefined>()
const frame = ref<HTMLDivElement | undefined>()
const handler = ref<HTMLDivElement | undefined>()
const liveModel = ref<HTMLCanvasElement>()
const camView = ref<HTMLVideoElement>()
const meshView = ref<HTMLCanvasElement>()
const loaded = ref(false)
const modelSize = ref(0)
const display = reactive({
  scale: 0,
  offsetX: 0,
  offsetY: 0,
})
let offsetTop = 0
let offsetLeft = 0

const { position: containerPosition } = useDraggable(frame as unknown as HTMLElement, { initialValue: position })
const { isDragging: handlerDown } = useDraggable(handler as unknown as HTMLElement, {
  onMove({ x, y }) {
    size.value = Math.max(minSize, Math.min((x - position.value.x) / scale.value, (y - position.value.y) / scale.value) / 0.8536)
  },
})

const _containerStyle = computed(() => {
  return {
    left: `${(containerPosition.value.x - offsetLeft) / scale.value}px`,
    top: `${(containerPosition.value.y - offsetTop) / scale.value}px`,
  }
})

const frameStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
}))

const handleStyle = computed(() => ({
  width: '8px',
  height: '8px',
  // 0.5 + 0.5 / sqrt(2)
  top: `${size.value * 0.8536 - 4}px`,
  left: `${size.value * 0.8536 - 4}px`,
  cursor: 'nwse-resize',
}))

// const modelUrl = '/models/hiyori/hiyori_pro_t10.model3.json'
let currentModel: any
let pixiApp: typeof Application
const modelUrl = computed(() =>
  typeof props.model === 'string'
    ? props.model
    : 'https://raw.githubusercontent.com/Live2D/CubismWebSamples/develop/Samples/Resources/Hiyori/Hiyori.model3.json',
)
const setDisplay = () => {
  const scale = Math.max(0.1, display.scale / 10)
  const offsetX = (scale - 1) / 2 - display.offsetX / 20
  const offsetY = display.offsetY / 20
  if (currentModel) {
    currentModel.scale.set(scale)
    currentModel.x = -modelSize.value * offsetX
    currentModel.y = -modelSize.value * offsetY
  }
}
const initDisplay = () => {
  display.scale = props.display!.scale * 10
  display.offsetX = props.display!.offsetX
  display.offsetY = props.display!.offsetY
  setDisplay()
}

async function initLive2D() {
  if (modelUrl.value) {
    currentModel = await Live2DModel.from(modelUrl.value, { autoInteract: false })
    const { width, height } = currentModel
    modelSize.value = Math.min(width, height)

    pixiApp = new Application({
      backgroundAlpha: 0,
      autoStart: true,
      width: modelSize.value,
      height: modelSize.value,
      view: liveModel.value,
    })

    pixiApp.stage.addChild(currentModel)
    initDisplay()
    currentModel.buttonMode = true
    currentModel.interactive = true

    pixiApp.renderer.plugins.interaction.destroy()
    // currentModel.on('pointerdown', () => {
    //   // camView.value.style.visibility = showGuides.value ? 'visible' : 'hidden';
    // })
  }
}
// draw connectors and landmarks on output canvas
const drawResults = (points: any) => {
  if (!props.showMesh || !meshView.value || !camView.value || !points) return
  meshView.value.width = camView.value.videoWidth
  meshView.value.height = camView.value.videoHeight
  const canvasCtx = meshView.value.getContext('2d')
  canvasCtx!.save()
  canvasCtx!.clearRect(0, 0, meshView.value.width, meshView.value.height)
  // Use `Mediapipe` drawing functions
  mpDrawing.drawConnectors(canvasCtx!, points, mpFaceMesh.FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1,
  })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_RIGHT_EYE,
    { color: '#FF3030' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_RIGHT_EYEBROW,
    { color: '#FF3030' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_LEFT_EYE,
    { color: '#30FF30' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_LEFT_EYEBROW,
    { color: '#30FF30' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_FACE_OVAL,
    { color: '#E0E0E0' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_LIPS, { color: '#E0E0E0' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_RIGHT_IRIS,
    { color: '#FF3030' })
  mpDrawing.drawConnectors(
    canvasCtx!, points, mpFaceMesh.FACEMESH_LEFT_IRIS,
    { color: '#30FF30' })
}

// update live2d model internal state
const rigFace = (result: TFace|undefined, lerpAmount = 0.7) => {
  if (!currentModel || !result) return
  const coreModel: any = currentModel.internalModel.coreModel

  currentModel.internalModel.motionManager.update = () => {
    // disable default blink animation
    currentModel.internalModel.eyeBlink = undefined

    coreModel.setParameterValueById(
      'ParamEyeBallX',
      lerp(result.pupil.x, coreModel.getParameterValueById('ParamEyeBallX'), lerpAmount),
    )
    coreModel.setParameterValueById(
      'ParamEyeBallY',
      lerp(result.pupil.y, coreModel.getParameterValueById('ParamEyeBallY'), lerpAmount),
    )

    // X and Y axis rotations are swapped for Live2D parameters
    // because it is a 2D system and KalidoKit is a 3D system
    coreModel.setParameterValueById(
      'ParamAngleX',
      lerp(result.head.degrees.y, coreModel.getParameterValueById('ParamAngleX'), lerpAmount),
    )
    coreModel.setParameterValueById(
      'ParamAngleY',
      lerp(result.head.degrees.x, coreModel.getParameterValueById('ParamAngleY'), lerpAmount),
    )
    coreModel.setParameterValueById(
      'ParamAngleZ',
      lerp(result.head.degrees.z, coreModel.getParameterValueById('ParamAngleZ'), lerpAmount),
    )

    // update body params for models without head/body param sync
    const dampener = 0.3
    coreModel.setParameterValueById(
      'ParamBodyAngleX',
      lerp(result.head.degrees.y * dampener, coreModel.getParameterValueById('ParamBodyAngleX'), lerpAmount),
    )
    coreModel.setParameterValueById(
      'ParamBodyAngleY',
      lerp(result.head.degrees.x * dampener, coreModel.getParameterValueById('ParamBodyAngleY'), lerpAmount),
    )
    coreModel.setParameterValueById(
      'ParamBodyAngleZ',
      lerp(result.head.degrees.z * dampener, coreModel.getParameterValueById('ParamBodyAngleZ'), lerpAmount),
    )

    // Simple example without winking.
    // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    const stabilizedEyes = Face.stabilizeBlink(
      {
        l: lerp(result.eye.l, coreModel.getParameterValueById('ParamEyeLOpen'), 0.7),
        r: lerp(result.eye.r, coreModel.getParameterValueById('ParamEyeROpen'), 0.7),
      },
      result.head.y,
    )
    // eye blink
    coreModel.setParameterValueById('ParamEyeLOpen', stabilizedEyes.l)
    coreModel.setParameterValueById('ParamEyeROpen', stabilizedEyes.r)

    // mouth
    coreModel.setParameterValueById(
      'ParamMouthOpenY',
      lerp(result.mouth.y, coreModel.getParameterValueById('ParamMouthOpenY'), 0.3),
    )
    // Adding 0.3 to ParamMouthForm to make default more of a "smile"
    coreModel.setParameterValueById(
      'ParamMouthForm',
      0.3 + lerp(result.mouth.x, coreModel.getParameterValueById('ParamMouthForm'), 0.3),
    )
  }
}

const animateLive2DModel = (points: any) => {
  if (!currentModel || !points) return

  let riggedFace

  if (points) {
    // use kalidokit face solver
    riggedFace = Face.solve(points, {
      runtime: 'mediapipe',
      video: camView.value,
    })
    rigFace(riggedFace, 0.5)
    serverVitarState.data = riggedFace
  }
}

const onResults = (results: any) => {
  if (!loaded.value && results.multiFaceLandmarks[0]) {
    loaded.value = true
    if (!serverVitarState.sync)
      serverVitarState.sync = true
  }
  // serverVitarState.data = results.multiFaceLandmarks[0]
  if (props.showMesh)
    drawResults(results.multiFaceLandmarks[0])
  animateLive2DModel(results.multiFaceLandmarks[0])
}

async function initMediapipe() {
  if (!props.mediaPipe)
    return
  mpFaceMesh = window as any
  mpCamera = window as any
  mpDrawing = window as any

  const canvasCtx = meshView.value!.getContext('2d')
  canvasCtx!.clearRect(0, 0, meshView.value!.width, meshView.value!.height)
  meshView.value!.style.visibility = props.showMesh ? 'inline' : 'none'
  camView.value!.style.visibility = props.showCam ? 'visible' : 'hidden'

  faceMesh = new mpFaceMesh.FaceMesh({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${mpFaceMesh.VERSION}/${file}`
    },
  })

  const solutionOptions = {
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
  }

  faceMesh.setOptions(solutionOptions)

  faceMesh.onResults(onResults)

  camera = new mpCamera.Camera(camView.value!, {
    onFrame: async() => {
      await faceMesh.send({ image: camView.value! })
    },
    width: 640,
    height: 480,
  })
  camera.start()
}

function getElementContent() {
  const content = document.getElementById('slide-content')!
  offsetLeft = content.getBoundingClientRect().left
  offsetTop = content.getBoundingClientRect().top
}

watch(() => props.showCam, () => {
  if (props.mediaPipe)
    camView.value!.style.visibility = props.showCam ? 'visible' : 'hidden'
})

watch(() => props.showMesh, () => {
  if (props.mediaPipe) {
    const canvasCtx = meshView.value!.getContext('2d')
    canvasCtx!.clearRect(0, 0, meshView.value!.width, meshView.value!.height)
    meshView.value!.style.visibility = props.showMesh ? 'inline' : 'none'
  }
})

watch(() => props.model, async() => {
  if (pixiApp && currentModel) {
    pixiApp.destroy(false, true)
    currentModel = null
    await initLive2D()
  }
})

watch(() => props.display, () => {
  initDisplay()
})

watch(display, () => {
  setDisplay()
})

watch(scale, () => {
  nextTick(() => {
    getElementContent()
    position.value.x = (slideWidth.value - size.value - 20) * scale.value + offsetLeft
    position.value.y = (slideHeight.value - size.value - 20) * scale.value + offsetTop
  })
})

watch(serverVitarState, (v) => {
  if (!isPresenter.value && v.sync && v.data)
    rigFace(v.data, 0.5)
    // animateLive2DModel(v.data)
    // console.log(v.data)
})

onMounted(async() => {
  // register the Ticker to support automatic updating of Live2D models
  if (!pluginRegisted.value)
    pluginRegisted.value = true
    // Application.registerPlugin(TickerPlugin)
    // Live2DModel.registerTicker(Ticker)

  getElementContent()
  await initLive2D()
  await initMediapipe()
})
onUnmounted(async() => {
  if (camera)
    await camera.stop()
  if (faceMesh)
    await faceMesh.close()
  if (pixiApp && currentModel) {
    pixiApp.destroy(true, true)
    currentModel = null
  }
})
</script>

<template>
  <div
    ref="container"
    class="fixed"
    :style="[_containerStyle , {zIndex}]"
  >
    <div
      v-if="model"
      ref="frame"
      class="rounded-full shadow bg-gray-400 bg-opacity-10 overflow-hidden object-cover"
      :style="frameStyle"
    >
      <canvas ref="liveModel" class="object-cover min-w-full min-h-full rounded-full" :style="frameStyle" />
    </div>
    <div
      v-if="model"
      ref="handler"
      class="absolute bottom-0 right-0 bg-green-500 rounded-full bg-main shadow
      opacity-50 shadow z-30 hover:opacity-100 dark:(border border-true-gray-700)"
      :style="handleStyle"
      :class="[
        handlerDown ? '!opacity-100' : '',
        loaded ? 'bg-green-500 dark:(border bg-green-500)' :
        (!isPresenter && serverVitarState.sync ? 'bg-blue-500 dark:(border bg-blue-500)' : 'bg-red-500 dark:(border bg-red-500)')
      ]"
    />
    <div
      v-if="mediaPipe"
      class="absolute bottom-0"
      style="transform: rotateY(180deg);"
      :style="[frameStyle, {right: `${size}px`}]"
    >
      <video ref="camView" class="absolute bottom-0 left-0 w-full h-auto" />
      <canvas ref="meshView" class="absolute bottom-0 left-0 w-full h-auto" />
    </div>
    <div
      v-if="mediaPipe && showMesh && size > 120"
      class="absolute top-0" :style="[frameStyle, {zIndex: zIndex! + 1, right: `${size}px`}]"
    >
      <div>
        s:
        <button class="vitar-btn" @click="display.scale--">
          -
        </button>
        <button class="vitar-btn" @click="display.scale++">
          +
        </button>
        {{ `${Math.max(0.1, display.scale / 10)}` }}
      </div>
      <div>
        x:
        <button class="vitar-btn" @click="display.offsetX--">
          -
        </button>
        <button class="vitar-btn" @click="display.offsetX++">
          +
        </button>
        {{ `${display.offsetX}` }}
      </div>
      <div>
        y:
        <button class="vitar-btn" @click="display.offsetY--">
          -
        </button>
        <button class="vitar-btn" @click="display.offsetY++">
          +
        </button>
        {{ `${display.offsetY}` }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.vitar-btn {
  margin-right: 0.25rem;
}
</style>
