<script setup>
defineProps({
  label: {
    type: String,
    default: 'Button'
  }
})

const emit = defineEmits(['click'])

function handleClick(event) {
  emit('click', event)
}
</script>

<template>
  <button class="green-button" @click="handleClick">
    <span class="content">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<style scoped>
.green-button {
  /* 重置默认按钮样式 */
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  
  /* 设置背景图 */
  background-image: url('@/assets/Green/Default/button_rectangle_flat.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  /* 尺寸和布局 */
  min-width: 140px;
  height: 45px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
  /* 字体样式 */
  font-family: inherit;
  font-weight: bold;
  font-size: 16px;
  color: #2e7d32;
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  
  /* 交互效果 */
  transition: transform 0.1s, filter 0.1s;
  user-select: none;
}

.green-button:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.green-button:active {
  transform: translateY(1px) scale(0.98);
  filter: brightness(0.95);
}

.content {
  /* 确保文字在按钮中心稍微偏上一点点，视觉平衡 */
  padding-bottom: 2px;
}
</style>
