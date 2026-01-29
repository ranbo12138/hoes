<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="base-panel">
    <!-- 顶部装饰线 -->
    <div class="ornament-top"></div>

    <div v-if="title" class="panel-header">
      <div class="header-deco left"></div>
      <h3 class="panel-title">{{ title }}</h3>
      <div class="header-deco right"></div>
    </div>
    
    <div class="panel-content">
      <slot></slot>
    </div>

    <!-- 底部装饰线 -->
    <div class="ornament-bottom"></div>
  </div>
</template>

<style scoped>
.base-panel {
  position: relative;
  background: var(--bg-panel); /* 保持半透明深色 */
  
  /* 魔法玻璃质感 */
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.8), /* 内阴影增加深度 */
    0 0 0 1px rgba(212, 175, 55, 0.2), /* 细微金边 */
    var(--shadow-panel);
    
  backdrop-filter: blur(12px);
  border-radius: 4px; /* 轻微圆角 */
  padding: 24px;
  color: var(--text-main);
  
  /* 进场动画 */
  animation: modal-pop 0.4s var(--ease-out-back);
  
  /* 纹理叠加 (可选，如果觉得太乱可以去掉) */
  background-image: 
    linear-gradient(rgba(26, 11, 46, 0.6), rgba(26, 11, 46, 0.9)),
    radial-gradient(circle at center, rgba(255,215,0,0.03) 0%, transparent 70%);
}

/* --- 装饰性花纹 (CSS绘制) --- */
.ornament-top, .ornament-bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  opacity: 0.5;
}

.ornament-top { top: 4px; }
.ornament-bottom { bottom: 4px; }

/* 边角装饰 (利用伪元素) */
.base-panel::before, .base-panel::after {
  content: '';
  position: absolute;
  width: 8px; height: 8px;
  border: 1px solid var(--color-gold);
  transition: all 0.5s ease;
  opacity: 0.6;
}

.base-panel::before { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.base-panel::after { bottom: 6px; right: 6px; border-left: none; border-top: none; }

/* 悬停微动效 */
.base-panel:hover::before, .base-panel:hover::after {
  width: 12px; height: 12px;
  opacity: 1;
  box-shadow: 0 0 4px var(--color-gold);
}

/* --- 标题区域 --- */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.panel-title {
  margin: 0 16px;
  font-family: var(--font-main);
  color: var(--color-gold);
  font-size: 1.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  /* 黄金文字效果 */
  background: linear-gradient(180deg, #FFF8E1 0%, #FFD700 50%, #B8860B 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 0 rgba(0,0,0,0.5));
}

.header-deco {
  height: 2px;
  flex: 1;
  max-width: 60px;
  background: var(--color-gold);
}

.header-deco.left { background: linear-gradient(90deg, transparent, var(--color-gold)); }
.header-deco.right { background: linear-gradient(-90deg, transparent, var(--color-gold)); }

.panel-content {
  position: relative;
  z-index: 1;
}
</style>
