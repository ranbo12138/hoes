<script setup lang="ts">
import { ref, computed } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  message: string
  duration?: number
}

const props = defineProps<{
  toast: ToastMessage
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const typeClass = computed(() => `toast-${props.toast.type}`)
const iconColor = computed(() => {
  const colors: Record<ToastType, string> = {
    success: 'var(--color-gold)',
    error: 'var(--color-red-light)',
    warning: 'var(--color-gold-light)',
    info: 'var(--color-purple-light)'
  }
  return colors[props.toast.type]
})
</script>

<template>
  <div class="game-toast" :class="typeClass">
    <div class="toast-icon" :style="{ color: iconColor }">
      <span class="icon-dot"></span>
    </div>
    <div class="toast-message">{{ toast.message }}</div>
  </div>
</template>

<style scoped>
.game-toast {
  position: relative;
  background: var(--bg-panel);
  border: 1px solid var(--color-gold-dark);
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.toast-message {
  flex: 1;
  color: var(--text-main);
  font-size: 0.9rem;
}

/* 类型样式 */
.toast-success {
  border-color: var(--color-gold);
}

.toast-error {
  border-color: var(--color-red-light);
}

.toast-warning {
  border-color: var(--color-gold-light);
}

.toast-info {
  border-color: var(--color-purple-light);
}
</style>