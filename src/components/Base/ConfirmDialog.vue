<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '确认'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="confirm-overlay">
    <div class="confirm-dialog">
      <div class="confirm-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="confirm-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-footer">
        <button class="btn-cancel" @click="handleCancel">{{ cancelText }}</button>
        <button class="btn-confirm" @click="handleConfirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: var(--bg-panel);
  border: 1px solid var(--color-gold);
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.confirm-header h3 {
  margin: 0 0 16px 0;
  color: var(--color-gold);
  font-size: 1.2rem;
}

.confirm-body p {
  margin: 0 0 24px 0;
  color: var(--text-main);
  line-height: 1.5;
}

.confirm-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-cancel {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  color: var(--text-main);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-confirm {
  background: var(--color-gold);
  border: 1px solid var(--color-gold);
  color: #000;
}

.btn-confirm:hover {
  background: var(--color-gold-light);
}
</style>