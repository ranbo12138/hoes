<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  breaks: true, // 转换 \n 为 <br>
  linkify: true // 自动识别 URL
})

const props = defineProps({
  log: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete', 'regenerate'])

const isEditing = ref(false)
const editText = ref('')
const isToolbarVisible = ref(false) // 控制工具栏显示

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!props.log.text) return ''
  return md.render(props.log.text)
})

function startEdit() {
  editText.value = props.log.text
  isEditing.value = true
  isToolbarVisible.value = false
}

function saveEdit() {
  if (editText.value.trim()) {
    emit('update', props.log.id, editText.value)
  }
  isEditing.value = false
}

function cancelEdit() {
isEditing.value = false
  editText.value = ''
}

function handleDelete() {
  if (confirm('确定要删除这条记录吗？')) {
    emit('delete', props.log.id)
  }
}

function handleRegenerate() {
  if (confirm('重新生成将会删除当前回复，重新请求 AI。继续吗？')) {
    emit('regenerate', props.log.id)
  }
}

// 点击日志项切换工具栏显示 (非编辑模式下)
function toggleToolbar() {
  if (!isEditing.value) {
    isToolbarVisible.value = !isToolbarVisible.value
  }
}
</script>

<template>
  <div 
    class="log-item"
    :class="[log.type, { active: isToolbarVisible, editing: isEditing }]"
    @click="toggleToolbar"
  >
    <!-- 名字 -->
    <div v-if="log.type !== 'system'" class="log-name">{{ log.name }}</div>

    <!-- 内容 (普通模式) -->
    <div v-if="!isEditing" class="log-content-box markdown-content" v-html="renderedContent"></div>

    <!-- 内容 (编辑模式) -->
    <div v-else class="edit-mode" @click.stop>
      <textarea v-model="editText" rows="3"></textarea>
      <div class="edit-actions">
        <BaseButton class="mini-btn" @click="saveEdit">保存</BaseButton>
        <BaseButton class="mini-btn" variant="secondary" @click="cancelEdit">取消</BaseButton>
      </div>
    </div>

    <!-- 迷你工具栏 -->
    <div v-if="isToolbarVisible && !isEditing" class="mini-toolbar" @click.stop>
      <button class="tool-text-btn" @click="startEdit">修改</button>
      <button class="tool-text-btn" @click="handleDelete">删除</button>
      <button class="tool-text-btn" @click="handleRegenerate">重试</button>
    </div>
  </div>
</template>

<style scoped>
.log-item {
  margin-bottom: 20px;
  max-width: 600px; /* 限制宽度 */
  margin-left: auto; margin-right: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.log-name {
  font-size: 0.8rem;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--color-gold-dark);
  margin-left: 8px;
}

.log-content-box {
  background: rgba(46, 26, 71, 0.6); /* 紫色半透明 */
  border: 1px solid rgba(255, 215, 0, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  border-top-left-radius: 2px; /* 气泡感 */
  color: var(--text-main);
  line-height: 1.6;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* --- Markdown Styles --- */
.markdown-content :deep(p) {
  margin-bottom: 0.8em;
}
.markdown-content :deep(p):last-child {
  margin-bottom: 0;
}
.markdown-content :deep(strong) {
  color: var(--color-gold);
  font-weight: 700;
}
.markdown-content :deep(em) {
  font-style: italic;
  color: #E0C0FF; /* 浅紫色 */
}
.markdown-content :deep(ul), .markdown-content :deep(ol) {
  margin-left: 1.2em;
  margin-bottom: 0.8em;
}
.markdown-content :deep(li) {
  margin-bottom: 0.4em;
}
.markdown-content :deep(h1), .markdown-content :deep(h2), .markdown-content :deep(h3) {
  color: var(--color-gold);
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-size: 1.1em;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: 4px;
}
.markdown-content :deep(blockquote) {
  border-left: 3px solid var(--color-gold-dark);
  padding-left: 10px;
  color: var(--text-dim);
  font-style: italic;
  margin: 0.5em 0;
}
.markdown-content :deep(code) {
  background: rgba(0,0,0,0.3);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

/* 玩家气泡 */
.log-item.player {
  align-items: flex-end;
}
.log-item.player .log-name {
  margin-right: 8px;
  margin-left: 0;
  color: var(--color-gold);
}
.log-item.player .log-content-box {
  background: rgba(60, 30, 80, 0.8);
  border-color: rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  border-top-right-radius: 2px;
  border-top-left-radius: 12px;
}

/* 系统消息 */
.log-item.system {
  align-items: center;
  margin: 30px 0;
}
.log-item.system .log-content-box {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.85rem;
  text-align: center;
  padding: 0;
}

/* --- Edit Mode --- */
.edit-mode textarea {
  width: 100%;
  background: rgba(0,0,0,0.5);
  border: 1px solid var(--color-gold-dark);
  color: var(--text-main);
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-family: inherit;
  resize: vertical;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.mini-btn :deep(button) {
  min-width: 60px;
  height: 30px;
  font-size: 0.8rem;
}

.mini-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
  padding-right: 4px;
  opacity: 0.6;
  animation: fadeIn 0.2s ease;
}

.tool-text-btn {
  background: none; border: none;
  color: var(--text-dim);
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 0.6; transform: translateY(0); }
}
</style>
