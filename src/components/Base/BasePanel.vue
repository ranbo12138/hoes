<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default' // default | glass | solid
  }
})
</script>

<template>
  <div class="base-panel" :class="variant">
    <!-- 装饰性边框容器 -->
    <div class="panel-border-container">
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
      <div class="border-line top"></div>
      <div class="border-line bottom"></div>
      <div class="border-line left"></div>
      <div class="border-line right"></div>
    </div>

    <!-- 标题区 -->
    <div v-if="title" class="panel-header">
      <div class="title-ornament left"></div>
      <h3 class="panel-title">{{ title }}</h3>
      <div class="title-ornament right"></div>
    </div>
    
    <!-- 内容区 -->
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.base-panel {
  position: relative;
  background: var(--bg-panel);
  /* 八边形切角 (Chamfered Corners) */
  clip-path: polygon(
    12px 0, calc(100% - 12px) 0, 
    100% 12px, 100% calc(100% - 12px), 
    calc(100% - 12px) 100%, 12px 100%, 
    0 calc(100% - 12px), 0 12px
  );
  padding: 24px;
  color: var(--text-main);
  box-shadow: var(--shadow-panel);
  animation: modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  /* 内部光晕 */
  box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
}

.base-panel.glass {
  background: rgba(13, 5, 24, 0.7);
  backdrop-filter: blur(8px);
}

/* --- 装饰性边框 (绘制在内部，不影响布局) --- */
.panel-border-container {
  position: absolute;
  inset: 4px; /* 稍微向内缩进 */
  pointer-events: none;
  z-index: 0;
  border: 1px solid rgba(197, 160, 40, 0.15); /* 极淡的基础边框 */
  
  /* 同样的切角 */
  clip-path: polygon(
    8px 0, calc(100% - 8px) 0, 
    100% 8px, 100% calc(100% - 8px), 
    calc(100% - 8px) 100%, 8px 100%, 
    0 calc(100% - 8px), 0 8px
  );
}

/* 角落装饰 */
.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--color-gold);
  border-style: solid;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.corner.top-left { top: 0; left: 0; border-width: 2px 0 0 2px; }
.corner.top-right { top: 0; right: 0; border-width: 2px 2px 0 0; }
.corner.bottom-left { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.corner.bottom-right { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

/* 边线光效 */
.border-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  opacity: 0.3;
}
.border-line.top { top: 0; left: 20%; right: 20%; height: 1px; }
.border-line.bottom { bottom: 0; left: 20%; right: 20%; height: 1px; }
.border-line.left { left: 0; top: 20%; bottom: 20%; width: 1px; background: linear-gradient(180deg, transparent, var(--color-gold), transparent); }
.border-line.right { right: 0; top: 20%; bottom: 20%; width: 1px; background: linear-gradient(180deg, transparent, var(--color-gold), transparent); }

/* --- 标题区域 --- */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.panel-title {
  margin: 0 16px;
  font-family: var(--font-main);
  color: var(--color-gold);
  font-size: 1.4rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0,0,0,1);
  font-weight: 400;
  
  /* 金属质感 */
  background: linear-gradient(180deg, #FFF 0%, #FFD700 50%, #8A6E18 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-ornament {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold-dark));
  max-width: 40px;
  position: relative;
}
.title-ornament.left { background: linear-gradient(90deg, transparent, var(--color-gold-dark)); }
.title-ornament.right { background: linear-gradient(-90deg, transparent, var(--color-gold-dark)); }

.title-ornament::after {
  content: '';
  position: absolute;
  width: 4px; height: 4px;
  background: var(--color-gold);
  transform: rotate(45deg);
  top: -1.5px;
}
.title-ornament.left::after { right: -6px; }
.title-ornament.right::after { left: -6px; }

.panel-content {
  position: relative;
  z-index: 1;
}

/* Hover 交互增强 */
.base-panel:hover .corner {
  opacity: 1;
  width: 12px;
  height: 12px;
  box-shadow: 0 0 8px var(--color-gold);
}
</style>
