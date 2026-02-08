<script setup>
import { useRouter } from 'vue-router'
import { 
  PhCaretLeft
} from '@phosphor-icons/vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  onBack: {
    type: Function,
    default: null
  }
})

const router = useRouter()

function handleBack() {
  if (props.onBack) {
    props.onBack()
  } else {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }
}
</script>

<template>
  <header class="top-bar">
    <div class="left-section">
      <button v-if="showBack" class="back-button" @click="handleBack" aria-label="返回">
        <PhCaretLeft weight="bold" class="icon-svg" />
        <span class="back-text">返回</span>
      </button>
      <slot name="left"></slot>
    </div>

    <div class="center-section">
      <h1 v-if="title" class="bar-title">{{ title }}</h1>
      <slot name="center"></slot>
    </div>

    <div class="right-section">
      <slot name="right"></slot>
    </div>
  </header>
  <!-- 占位元素 -->
  <div class="top-bar-placeholder"></div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height, 48px);
  background: rgba(26, 11, 46, 0.95);
  border-bottom: 1px solid var(--color-gold-dark);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.top-bar-placeholder {
  height: var(--header-height, 48px);
  width: 100%;
}

.left-section, .right-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.right-section {
  justify-content: flex-end;
}

.center-section {
  flex: 2;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.bar-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-gold);
  font-family: var(--font-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* --- 返回按钮样式 --- */
.back-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 4px;
  color: var(--text-dim);
  font-family: var(--font-ui);
  transition: color 0.2s;
}

.back-button:active {
  opacity: 0.7;
  color: var(--color-gold);
}

.icon-svg {
  font-size: 1.2rem;
  margin-right: 2px;
}

.back-text {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
