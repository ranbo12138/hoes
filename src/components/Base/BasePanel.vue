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
    <!-- 装饰性边角 -->
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>

    <div v-if="title" class="panel-header">
      <h3 class="panel-title">{{ title }}</h3>
      <div class="divider"></div>
    </div>
    
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.base-panel {
  position: relative;
  background: var(--bg-panel);
  border: 1px solid var(--color-gold-dark);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(8px);
  padding: 24px;
  color: var(--text-main);
}

/* --- 装饰性花纹边角 (CSS绘制) --- */
.corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-gold);
  pointer-events: none;
}

.top-left {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* --- 标题区域 --- */
.panel-header {
  text-align: center;
  margin-bottom: 20px;
}

.panel-title {
  margin: 0;
  font-family: var(--font-main);
  color: var(--color-gold);
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: var(--shadow-text);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-gold-dark), transparent);
  margin-top: 8px;
  width: 100%;
}

.panel-content {
  position: relative;
  z-index: 1;
}
</style>
