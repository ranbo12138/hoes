<script setup>
import { ref, onMounted, watch } from 'vue'
import { removeBlackBackground } from '@/utils/pixelProcessors'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  threshold: {
    type: Number,
    default: 20 // 黑色容差，越大容忍越浅的灰色
  }
})

const canvasRef = ref(null)
const imgRef = ref(null)

function processImage() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.crossOrigin = "Anonymous"
  img.src = props.src
  
  img.onload = () => {
    // 设置画布尺寸
    canvas.width = img.width
    canvas.height = img.height
    
    // 绘制原图
    ctx.drawImage(img, 0, 0)
    
    // 获取像素数据
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // 调用解耦后的工具函数处理像素
    imageData = removeBlackBackground(imageData, props.threshold)
    
    // 将处理后的数据放回画布
    ctx.putImageData(imageData, 0, 0)
  }
}

onMounted(() => {
  if (props.src) {
    processImage()
  }
})

watch(() => props.src, () => {
  processImage()
})
</script>

<template>
  <div class="auto-transparent-container">
    <canvas ref="canvasRef" class="processed-canvas"></canvas>
  </div>
</template>

<style scoped>
.auto-transparent-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.processed-canvas {
  max-width: 100%;
  height: auto;
  /* 加上光晕效果 */
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
}
</style>
