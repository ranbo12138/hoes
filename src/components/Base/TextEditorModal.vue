<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import { PhX, PhArrowsOutSimple } from '@phosphor-icons/vue'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '文本编辑器'
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '在此输入...'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showPreview: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'save'])

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleClose() {
  emit('close')
}

function handleSave() {
  emit('save')
}

function handleFullscreen() {
  const textarea = document.querySelector('.editor-textarea')
  if (textarea) {
    textarea.requestFullscreen?.() || textarea.webkitRequestFullscreen?.()
  }
}
</script>

<template>
  <div v-if="show" class="editor-overlay">
    <div class="editor-modal">
      <div class="editor-header">
        <h3>{{ title }}</h3>
        <div class="header-actions">
          <button class="icon-btn" @click="handleFullscreen" title="全屏">
            <PhArrowsOutSimple size="20" />
          </button>
          <button class="icon-btn" @click="handleClose" title="关闭">
            <PhX size="20" />
          </button>
        </div>
      </div>

      <div class="editor-body">
        <textarea
          v-model="content"
          class="editor-textarea"
          :placeholder="placeholder"
          :readonly="readonly"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-footer">
        <span class="char-count">{{ content.length }} 字符</span>
        <div class="footer-actions">
          <BaseButton variant="secondary" @click="handleClose">取消</BaseButton>
          <BaseButton @click="handleSave" v-if="!readonly">保存</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.editor-modal {
  width: 95%;
  height: 90vh;
  max-height: 90vh;
  background: var(--bg-panel);
  border: 1px solid var(--color-gold);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-header h3 {
  margin: 0;
  color: var(--color-gold);
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  color: var(--color-gold);
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--color-gold);
}

.editor-body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.editor-textarea:focus {
  border-color: var(--color-gold);
}

.editor-textarea::placeholder {
  color: var(--text-dim);
}

.editor-textarea:read-only {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.05);
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.char-count {
  color: var(--text-dim);
  font-size: 0.85rem;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .editor-modal {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
  }

  .editor-header {
    padding: 12px 16px;
  }

  .editor-header h3 {
    font-size: 1rem;
  }

  .editor-body {
    padding: 12px;
  }

  .editor-textarea {
    font-size: 0.85rem;
    padding: 12px;
  }

  .editor-footer {
    padding: 12px 16px;
  }

  .footer-actions {
    flex-direction: column;
    gap: 8px;
  }

  .footer-actions button {
    width: 100%;
  }
}

/* 全屏模式 */
.editor-textarea:fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  border: none;
  border-radius: 0;
  padding: 20px;
}
</style>