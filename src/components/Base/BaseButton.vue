<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary' // 'primary' | 'secondary' | 'danger'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button 
    class="base-button" 
    :class="[variant, { disabled }]" 
    :disabled="disabled"
  >
    <!-- 背景流光层 -->
    <div class="glow-bg"></div>
    
    <!-- 内容层 -->
    <div class="content-wrapper">
      <span class="content">
        <slot>{{ label }}</slot>
      </span>
    </div>

    <!-- 边框流光 -->
    <div class="border-glow"></div>
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
  min-width: 140px; /* 稍微加宽 */
  height: 48px;     /* 增加高度以容纳更复杂的视觉 */
  font-family: var(--font-main);
  transition: transform 0.1s var(--ease-out-back);
  -webkit-tap-highlight-color: transparent;
  z-index: 10;
  
  /* 基础形状 */
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

/* --- 内部结构 --- */

/* 1. 背景层 */
.glow-bg {
  position: absolute;
  inset: 1px; /* 留出边框位置 */
  background: linear-gradient(135deg, rgba(46, 26, 71, 0.95) 0%, rgba(26, 11, 46, 0.98) 100%);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  z-index: 1;
  transition: all 0.3s ease;
}

/* 2. 内容层 */
.content-wrapper {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-gold);
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  transition: color 0.3s ease;
}

/* 3. 边框层 (伪装) */
.base-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, var(--color-gold-dark), var(--color-gold));
  z-index: 0; /* 最底层，作为边框颜色 */
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

/* --- 交互状态 --- */

/* Hover */
.base-button:not(.disabled):hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3));
}

.base-button:not(.disabled):hover .glow-bg {
  background: linear-gradient(135deg, rgba(74, 20, 140, 0.9) 0%, rgba(40, 20, 60, 0.95) 100%);
}

.base-button:not(.disabled):hover .content-wrapper {
  color: #FFF;
  text-shadow: 0 0 5px var(--color-gold);
}

.base-button:not(.disabled):hover::before {
  opacity: 1;
}

/* Active / Click */
.base-button:not(.disabled):active {
  transform: scale(0.96) translateY(0);
}

/* --- 变体 Variants --- */

/* Secondary: 更低调，紫色主调 */
.base-button.secondary .content-wrapper {
  color: var(--text-dim);
}
.base-button.secondary::before {
  background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.4));
}
.base-button.secondary:not(.disabled):hover .content-wrapper {
  color: var(--color-gold);
}

/* Disabled */
.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

/* --- 扫光动效 (Shine Wipe) --- */
.base-button:not(.disabled)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent
  );
  transform: skewX(-25deg);
  pointer-events: none;
  z-index: 3;
}

.base-button:not(.disabled):hover::after {
  animation: shine-wipe 0.6s ease;
}
</style>
