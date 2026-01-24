<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update:modelValue'])

const trackRef = ref(null)
const isDragging = ref(false)

// 计算百分比位置
const percentage = computed(() => {
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / (props.max - props.min)) * 100))
})

// 处理拖拽逻辑
function updateValueFromEvent(event) {
  if (!trackRef.value) return
  
  const rect = trackRef.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  
  let percent = (clientX - rect.left) / rect.width
  percent = Math.max(0, Math.min(1, percent))
  
  const newValue = Math.round(percent * (props.max - props.min) + props.min)
  emit('update:modelValue', newValue)
}

function startDrag(event) {
  isDragging.value = true
  updateValueFromEvent(event)
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', handleDrag)
  window.addEventListener('touchend', stopDrag)
}

function handleDrag(event) {
  if (!isDragging.value) return
  updateValueFromEvent(event)
}

function stopDrag() {
  isDragging.value = false
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', handleDrag)
  window.removeEventListener('touchend', stopDrag)
}
</script>

<template>
  <div class="green-slider-container">
    <div 
      class="slider-track" 
      ref="trackRef"
      @mousedown="startDrag"
      @touchstart.prevent="startDrag"
    >
      <!-- 进度条填充 (可选) -->
      <div class="slider-fill" :style="{ width: percentage + '%' }"></div>
      
      <!-- 滑块手柄 -->
      <div 
        class="slider-thumb"
        :style="{ left: percentage + '%' }"
      >
      </div>
    </div>
    <div class="slider-value">{{ modelValue }}</div>
  </div>
</template>

<style scoped>
.green-slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-width: 200px;
}

.slider-track {
  flex: 1;
  height: 14px;
  position: relative;
  /* 使用图片作为轨道背景 */
  background-image: url('@/assets/Green/Default/slide_horizontal_color.png');
  background-size: 100% 100%; 
  background-repeat: no-repeat;
  cursor: pointer;
  border-radius: 7px;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 24px; /* 根据 slide_hangle.png 的实际比例调整 */
  height: 26px;
  /* 使用手柄图片 */
  background-image: url('@/assets/Green/Default/slide_hangle.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.1s;
}

.slider-thumb:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}

.slider-value {
  font-weight: bold;
  color: #2e7d32;
  min-width: 30px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
