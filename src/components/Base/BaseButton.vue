<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary' 
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- 移除所有复杂的事件处理，完全依赖 Vue 的原生事件透传 -->
  <button 
    class="base-button" 
    :class="[variant, { disabled }]" 
    :disabled="disabled"
  >
    <div class="inner-border">
      <span class="content">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </button>
</template>

<style scoped>
.base-button {
  position: relative;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  user-select: none;
  min-width: 120px;
  height: 40px;
  font-family: var(--font-main);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  /* 确保按钮层级最高，能接收点击 */
  z-index: 100; 
  pointer-events: auto !important; 
}

.inner-border {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  
  /* 边框样式 */
  border: 1px solid var(--color-gold);
  background: linear-gradient(180deg, rgba(46,26,71,0.9) 0%, rgba(26,11,46,0.95) 100%);
  box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
  
  color: var(--color-gold);
  font-size: 0.95rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 1px 1px rgba(0,0,0,0.8);
  
  transition: all 0.2s ease;
  
  /* 关键修改：移除 pointer-events: none，让内容自然响应，依靠冒泡 */
}

/* 装饰性伪元素 */
.base-button::before,
.base-button::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-gold);
  z-index: 101;
  pointer-events: none; /* 仅装饰物不阻挡 */
}

.base-button::before { top: -1px; left: -1px; }
.base-button::after { bottom: -1px; right: -1px; }

/* 交互状态 */
.base-button:not(.disabled):hover .inner-border {
  border-color: var(--color-gold-light);
  background: rgba(74, 20, 140, 0.9);
}

.base-button:not(.disabled):active .inner-border {
  transform: scale(0.96);
  background: rgba(20, 10, 30, 0.95);
}

.base-button.secondary .inner-border {
    border-color: rgba(255,255,255,0.3);
    color: #ccc;
}
</style>
