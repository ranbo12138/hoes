<script setup>
import { ref } from 'vue'
import TextEditorModal from './TextEditorModal.vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '文本预览'
  },
  maxHeight: {
    type: String,
    default: '200px'
  },
  showLineNumbers: {
    type: Boolean,
    default: false
  }
})

const showEditor = ref(false)
const editableContent = ref(props.content)

function openEditor() {
  editableContent.value = props.content
  showEditor.value = true
}

function handleSave() {
  // 预览模式不需要保存
  showEditor.value = false
}

function handleClose() {
  showEditor.value = false
}

// 格式化内容（添加行号）
function formatContent(text) {
  if (!props.showLineNumbers) return text
  
  const lines = text.split('\n')
  return lines.map((line, index) => {
    const lineNumber = (index + 1).toString().padStart(3, ' ')
    return `${lineNumber} | ${line}`
  }).join('\n')
}
</script>

<template>
  <div class="text-preview" @click="openEditor">
    <div class="preview-header">
      <span class="preview-title">{{ title }}</span>
      <span class="preview-hint">点击放大</span>
    </div>
    <div class="preview-content" :style="{ maxHeight }">
      <pre>{{ formatContent(content) }}</pre>
    </div>
    <div class="preview-overlay">
      <span>点击查看完整内容</span>
    </div>
  </div>

  <TextEditorModal
    :show="showEditor"
    :title="title"
    v-model="editableContent"
    :readonly="true"
    @close="handleClose"
    @save="handleSave"
  />
</template>

<style scoped>
.text-preview {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.text-preview:hover {
  border-color: var(--color-gold-dark);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-title {
  color: var(--color-gold);
  font-size: 0.85rem;
  font-weight: 500;
}

.preview-hint {
  color: var(--text-dim);
  font-size: 0.75rem;
}

.preview-content {
  overflow: hidden;
  position: relative;
}

.preview-content pre {
  margin: 0;
  padding: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--text-main);
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  max-height: inherit;
  overflow-y: auto;
}

/* 添加渐变遮罩效果 */
.preview-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  pointer-events: none;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.text-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-overlay span {
  color: var(--color-gold);
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--color-gold);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .preview-content pre {
    font-size: 0.75rem;
    padding: 8px;
  }
}
</style>