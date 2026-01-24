<script setup>
import { ref } from 'vue'
import GreenButton from './GreenUI/GreenButton.vue'
import GreenCheckbox from './GreenUI/GreenCheckbox.vue'
import GreenSlider from './GreenUI/GreenSlider.vue'

import starImg from '@/assets/Green/Default/star.png'
import arrowImg from '@/assets/Green/Default/arrow_basic_e.png'

// 状态管理
const checkboxValue = ref(false)
const sliderValue = ref(50)
const clickCount = ref(0)

function handleButtonClick() {
  clickCount.value++
  alert(`Button Clicked! Count: ${clickCount.value}`)
}
</script>

<template>
  <div class="green-ui-gallery">
    <h2>Green UI Interactive Components</h2>
    
    <div class="gallery-grid">
      
      <!-- 按钮演示 -->
      <div class="gallery-item">
        <span class="label">Button</span>
        <div class="component-container">
          <GreenButton @click="handleButtonClick">
 Click Me
          </GreenButton>
        </div>
        <div class="status-text">Clicks: {{ clickCount }}</div>
      </div>

      <!-- 复选框演示 -->
      <div class="gallery-item">
        <span class="label">Checkbox</span>
        <div class="component-container">
          <GreenCheckbox v-model="checkboxValue" label="Enabled" />
        </div>
        <div class="status-text">State: {{ checkboxValue }}</div>
      </div>

      <!-- 滑块演示 -->
      <div class="gallery-item wide-item">
        <span class="label">Slider</span>
        <div class="component-container">
          <GreenSlider v-model="sliderValue" :min="0" :max="100" />
        </div>
        <div class="status-text">Value: {{ sliderValue }}</div>
      </div>

      <!-- 其他素材 (静态展示) -->
      <div class="gallery-item">
        <span class="label">Star Icon</span>
        <div class="component-container">
            <img :src="starImg" alt="Star" />
        </div>
      </div>

      <div class="gallery-item">
        <span class="label">Arrow Icon</span>
        <div class="component-container">
            <img :src="arrowImg" alt="Arrow" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.green-ui-gallery {
  padding: 30px;
  background-color: #e8f5e9;
  border-radius: 16px;
  color: #1b5e20;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(27, 94, 32, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8em;
    color: #2e7d32;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  min-width: 160px;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.wide-item {
  min-width: 300px; /* 给滑块更多空间 */
}

.component-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
}

.component-container img {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
}

.label {
    font-weight: bold;
    font-size: 1.1em;
    color: #388e3c;
}

.status-text {
  font-size: 0.85em;
  color: #666;
  font-family: monospace;
}
</style>
