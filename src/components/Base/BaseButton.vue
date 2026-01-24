<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary' // 预留扩展：primary, danger, ghost
  }
})

const emit = defineEmits(['click'])

function handleClick(event) {
  // 这里可以添加全局点击音效逻辑
  emit('click', event)
}
</script>

<template>
  <button class="base-button" @click="handleClick">
    <span class="content">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<style scoped>
.base-button {
  /* 基础重置 */
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  
  /* 默认使用 GreenUI 的绿色按钮资源 (此处模拟 Base 风格) */
  /* 实际项目中，这里应该根据 variant 切换背景图 */
  background-image: url('@/assets/Green/Default/button_rectangle_flat.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  /* 尺寸 */
  min-width: 140px;
  height: 45px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
  /* 字体优化：高对比度游戏风格 */
  font-weight: 900; /* 加粗 */
  font-size: 18px;  /* 稍微加大 */
  color: #ffffff;   /* 纯白文字 */
  
  /* 强烈的黑色描边/阴影，确保在任何背景下都清晰 */
  text-shadow: 
    0 2px 0 #004d40, /* 深绿底色模拟立体感 */
    0 2px 4px rgba(0,0,0,0.6); 
  
  transition: transform 0.1s, filter 0.1s;
  user-select: none;
}

.base-button:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.base-button:active {
  transform: translateY(1px) scale(0.98);
  filter: brightness(0.95);
}

.content {
  padding-bottom: 2px;
}
</style>
